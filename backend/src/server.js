import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { timingSafeEqual } from 'node:crypto';
import cors from 'cors';
import express from 'express';
import pg from 'pg';
import { seedDatabase } from './seed.js';

const { Pool } = pg;
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const databaseUrl = process.env.DATABASE_URL;
const adminToken = process.env.ADMIN_TOKEN;
const isProduction = process.env.NODE_ENV === 'production';
const frontendOrigin = process.env.FRONTEND_ORIGIN || (isProduction ? '' : 'http://localhost:5173');

if (!databaseUrl) throw new Error('DATABASE_URL é obrigatória.');
if (!adminToken || adminToken.length < 24) throw new Error('Defina ADMIN_TOKEN com pelo menos 24 caracteres.');
if (!frontendOrigin) throw new Error('FRONTEND_ORIGIN é obrigatória em produção.');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
const app = express();
const port = Number(process.env.PORT || 3001);

app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, false);
    if (origin === frontendOrigin) return callback(null, true);
    return callback(new Error('Origem não autorizada pelo CORS.'));
  },
  methods: ['GET', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-token'],
}));
app.use(express.json({ limit: '256kb' }));

function requireAdmin(req, res, next) {
  const supplied = req.get('x-admin-token') || '';
  const expected = Buffer.from(adminToken);
  const candidate = Buffer.from(supplied);
  if (candidate.length !== expected.length || !timingSafeEqual(candidate, expected)) {
    return res.status(401).json({ error: 'Token administrativo inválido.' });
  }
  return next();
}

app.get('/api/admin/verify', requireAdmin, (_req, res) => {
  res.json({ status: 'ok' });
});

async function loadDashboard() {
  const project = await pool.query('SELECT * FROM projetos ORDER BY id LIMIT 1');
  if (project.rowCount === 0) throw new Error('O projeto ainda não foi inicializado no banco de dados.');
  const projectId = project.rows[0].id;
  const [metricas, cronograma, equipe, modulos, acessibilidade, decisoes] = await Promise.all([
    pool.query('SELECT id, rotulo AS label, valor AS value, unidade AS unit, formato AS format, detalhe AS detail, icone AS icon FROM metricas WHERE projeto_id = $1 ORDER BY posicao, id', [projectId]),
    pool.query('SELECT id, nome AS name, duracao_meses AS duration_months, descricao AS description, atividades AS activities FROM cronograma WHERE projeto_id = $1 ORDER BY posicao, id', [projectId]),
    pool.query('SELECT id, nome AS name, qualificacao AS qualification, funcao AS role, responsabilidades AS responsibilities FROM equipe WHERE projeto_id = $1 ORDER BY posicao, id', [projectId]),
    pool.query('SELECT id, numero AS number, nome AS name, horas AS hours, descricao AS description, atividades AS activities FROM modulos WHERE projeto_id = $1 ORDER BY posicao, id', [projectId]),
    pool.query('SELECT id, titulo AS title, descricao AS description, itens AS items FROM acessibilidade WHERE projeto_id = $1 ORDER BY posicao, id', [projectId]),
    pool.query('SELECT id, titulo AS title, descricao AS description, status FROM decisoes WHERE projeto_id = $1 ORDER BY posicao, id', [projectId]),
  ]);
  const row = project.rows[0];
  return {
    projeto: {
      name: row.nome,
      subtitle: row.subtitulo,
      description: row.descricao,
      starts_on: row.data_inicio,
      ends_on: row.data_fim,
      global_amount: Number(row.valor_global),
      direct_audience: row.publico_direto,
      hours_workshops: row.horas_oficinas,
      hours_firings: row.horas_queimas,
      contact: row.contato,
    },
    metricas: metricas.rows.map((item) => ({ ...item, value: Number(item.value) })),
    cronograma: cronograma.rows,
    equipe: equipe.rows,
    modulos: modulos.rows,
    metodologia: row.metodologia,
    acessibilidade: acessibilidade.rows,
    decisoes: decisoes.rows,
  };
}

const sectionConfig = {
  metricas: {
    table: 'metricas',
    fields: { id: 'id', label: 'rotulo', value: 'valor', unit: 'unidade', format: 'formato', detail: 'detalhe', icon: 'icone' },
    required: ['id', 'label', 'value', 'format'],
    jsonFields: [],
    numericFields: ['value'],
  },
  cronograma: {
    table: 'cronograma',
    fields: { name: 'nome', duration_months: 'duracao_meses', description: 'descricao', activities: 'atividades' },
    required: ['name', 'duration_months'],
    jsonFields: ['atividades'],
    numericFields: ['duration_months'],
  },
  equipe: {
    table: 'equipe',
    fields: { name: 'nome', qualification: 'qualificacao', role: 'funcao', responsibilities: 'responsabilidades' },
    required: ['name'],
    jsonFields: [],
    numericFields: [],
  },
  modulos: {
    table: 'modulos',
    fields: { number: 'numero', name: 'nome', hours: 'horas', description: 'descricao', activities: 'atividades' },
    required: ['number', 'name', 'hours'],
    jsonFields: ['atividades'],
    numericFields: ['number', 'hours'],
  },
  acessibilidade: {
    table: 'acessibilidade',
    fields: { title: 'titulo', description: 'descricao', items: 'itens' },
    required: ['title'],
    jsonFields: ['itens'],
    numericFields: [],
  },
  decisoes: {
    table: 'decisoes',
    fields: { title: 'titulo', description: 'descricao', status: 'status' },
    required: ['title'],
    jsonFields: [],
    numericFields: [],
  },
};

async function replaceSection(section, items) {
  const config = sectionConfig[section];
  if (!Array.isArray(items) || items.length > 100 || items.some((item) => !item || typeof item !== 'object' || Array.isArray(item))) {
    const error = new Error('Envie uma lista JSON com até 100 objetos.');
    error.status = 400;
    throw error;
  }
  for (const item of items) {
    for (const field of config.required) {
      if (item[field] === undefined || item[field] === null || item[field] === '') {
        const error = new Error(`O campo "${field}" é obrigatório em todos os itens.`);
        error.status = 400;
        throw error;
      }
    }
    for (const key of config.jsonFields) {
      const inputField = Object.keys(config.fields).find((field) => config.fields[field] === key);
      if (item[inputField] !== undefined && !Array.isArray(item[inputField])) {
        const error = new Error(`O campo "${inputField}" deve ser uma lista.`);
        error.status = 400;
        throw error;
      }
    }
    for (const field of config.numericFields) {
      if (typeof item[field] !== 'number' || !Number.isFinite(item[field]) || item[field] < 0) {
        const error = new Error(`O campo "${field}" deve ser um número não negativo.`);
        error.status = 400;
        throw error;
      }
    }
    if (section === 'metricas' && !['currency', 'number', 'hours', 'months'].includes(item.format)) {
      const error = new Error('O formato da métrica não é válido.');
      error.status = 400;
      throw error;
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: projects } = await client.query('SELECT id FROM projetos ORDER BY id LIMIT 1');
    if (projects.length === 0) throw new Error('O projeto ainda não foi inicializado.');
    await client.query(`DELETE FROM ${config.table} WHERE projeto_id = $1`, [projects[0].id]);
    for (const [position, item] of items.entries()) {
      const inputFields = Object.keys(config.fields);
      const columns = ['projeto_id', ...inputFields.map((field) => config.fields[field]), 'posicao'];
      const values = [projects[0].id, ...inputFields.map((field) => {
        const value = item[field];
        return config.jsonFields.includes(config.fields[field]) && value !== undefined ? JSON.stringify(value) : (value ?? '');
      }), position];
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
      await client.query(`INSERT INTO ${config.table} (${columns.join(', ')}) VALUES (${placeholders})`, values);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

app.get('/api/ping', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/dados', async (_req, res, next) => {
  try {
    res.json(await loadDashboard());
  } catch (error) {
    next(error);
  }
});

for (const section of Object.keys(sectionConfig)) {
  app.put(`/api/${section}`, requireAdmin, async (req, res, next) => {
    try {
      await replaceSection(section, req.body);
      res.json({ status: 'ok', section });
    } catch (error) {
      next(error);
    }
  });
}

app.use((error, _req, res, _next) => {
  if (error.message === 'Origem não autorizada pelo CORS.') {
    return res.status(403).json({ error: error.message });
  }
  console.error(error);
  return res.status(error.status || 500).json({
    error: error.status ? error.message : 'Erro interno da API.',
  });
});

async function start() {
  const schema = await readFile(resolve(root, 'database/schema.sql'), 'utf8');
  await pool.query(schema);
  await seedDatabase(pool);
  app.listen(port, () => console.log(`API do projeto ativa na porta ${port}.`));
}

start().catch(async (error) => {
  console.error('Falha ao inicializar a API:', error);
  await pool.end();
  process.exitCode = 1;
});

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
