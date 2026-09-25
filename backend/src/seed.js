const projectSeed = {
  nome: 'Modelando Barro, Transformando Vidas II',
  subtitulo: 'Formação em cerâmica artística e inclusão social de mulheres idosas 60+',
  descricao: 'Formação gratuita em cerâmica artística para mulheres com 60 anos ou mais, promovendo inclusão social, expressão criativa, autonomia e convivência por meio do fazer manual.',
  data_inicio: '2027-03-31',
  data_fim: '2028-01-31',
  valor_global: 188339.8,
  publico_direto: 400,
  horas_oficinas: 64,
  horas_queimas: 87,
  contato: 'Grupo Semente Flor',
  metodologia: [
    'Acolhimento',
    'Contextualização (30 min)',
    'Demonstração (30 min)',
    'Prática orientada (120 min)',
    'Fechamento e avaliação',
  ],
};

const metricSeeds = [
  { id: 'participantes', rotulo: 'Participantes diretas', valor: 30, unidade: 'mulheres', formato: 'number', detalhe: 'Mulheres com 60 anos ou mais', icone: 'people' },
  { id: 'turmas', rotulo: 'Turmas simultâneas', valor: 3, unidade: 'turmas', formato: 'number', detalhe: '8 a 10 participantes por turma', icone: 'groups' },
  { id: 'modulos', rotulo: 'Módulos formativos', valor: 8, unidade: 'módulos', formato: 'number', detalhe: 'Percurso progressivo de aprendizagem', icone: 'modules' },
  { id: 'horas', rotulo: 'Carga horária', valor: 151, unidade: 'horas', formato: 'hours', detalhe: '64h de oficinas + 87h de queimas', icone: 'time' },
  { id: 'exposicoes', rotulo: 'Exposições gratuitas', valor: 2, unidade: 'exposições', formato: 'number', detalhe: 'Abertas à comunidade', icone: 'exhibit' },
  { id: 'publico', rotulo: 'Público direto', valor: 400, unidade: 'pessoas', formato: 'number', detalhe: 'Público estimado nas ações abertas', icone: 'audience' },
  { id: 'orcamento', rotulo: 'Valor homologado', valor: 188339.8, unidade: 'reais', formato: 'currency', detalhe: 'Valor global aprovado', icone: 'budget' },
  { id: 'duracao', rotulo: 'Duração do projeto', valor: 10, unidade: 'meses', formato: 'months', detalhe: '31/03/2027 a 31/01/2028', icone: 'time' },
];

const phaseSeeds = [
  {
    nome: 'Pré-produção',
    duracao_meses: 2,
    descricao: 'Preparação dos espaços, da equipe, dos materiais e do público para um início acolhedor e bem organizado.',
    atividades: [
      'Planejamento operacional e cronograma fino',
      'Seleção e visita técnica aos espaços',
      'Mobilização de 3 turmas e 30 participantes',
      'Contrato de locação do forno cerâmico',
      'Aquisição de argilas, esmaltes, óxidos e ferramentas',
      'Divulgação institucional e comunitária',
      'Contratações da equipe multidisciplinar',
      'Material didático acessível e identidade visual',
    ],
  },
  {
    nome: 'Execução / Produção',
    duracao_meses: 6,
    descricao: 'Encontros semanais em três turmas, experimentação cerâmica e acompanhamento psicossocial ao longo da formação.',
    atividades: [
      'Realização dos 8 módulos formativos',
      '3 turmas simultâneas, 1 encontro semanal por turma',
      'Ciclos de queima totalizando 87 horas',
      'Acompanhamento psicossocial',
      'Avaliação semanal das atividades',
    ],
  },
  {
    nome: 'Pós-produção',
    duracao_meses: 2,
    descricao: 'Celebração das criações com o público e conclusão das responsabilidades do projeto.',
    atividades: [
      'Realização de 2 exposições abertas e gratuitas',
      'Feira e bazar beneficente',
      'Mediação acessível das exposições',
      'Organização da prestação de contas',
    ],
  },
];

const teamSeeds = [
  {
    nome: 'Andrea Jaeger Foresti',
    qualificacao: 'Engenheira Civil e Assistente Social',
    funcao: 'Presidente',
    responsabilidades: 'Coordenação executiva, conformidade e supervisão das queimas.',
  },
  {
    nome: 'Milene Steffens',
    qualificacao: 'Assistente Social e Gestora de Projetos',
    funcao: 'Coordenadora Técnica',
    responsabilidades: 'Ações socioeducativas, monitoramento de metas e acolhimento.',
  },
  {
    nome: 'Andréa Castiglia',
    qualificacao: 'Educadora Física, Especialista em Gerontologia',
    funcao: 'Especialista em Gerontologia',
    responsabilidades: 'Adequação ergonômica e postural ao público 60+.',
  },
  {
    nome: 'Grupo Semente Flor',
    qualificacao: 'Corpo Docente Especializado',
    funcao: 'Agente Educativo(a) / Oficineiro(a)',
    responsabilidades: 'Oficinas de modelagem, técnicas, acabamento e esmaltação.',
  },
];

const moduleSeeds = [
  { numero: 1, nome: 'Envelhecer com Arte', horas: 4, descricao: 'Acolhimento, identidade e descoberta sensorial da argila.', atividades: ['Roda “Como envelhecer bem?”', 'Materiais de ateliê', 'Reconhecimento tátil da argila'] },
  { numero: 2, nome: 'Mãos na Massa', horas: 4, descricao: 'Preparação da argila e primeiros gestos de modelagem.', atividades: ['Ergonomia manual', 'Sova da massa', 'Esferas com controle de volume', 'Barbotina e queima teste'] },
  { numero: 3, nome: 'Modelando com Intenção', horas: 4, descricao: 'Memória de vida traduzida em formas e objetos utilitários.', atividades: ['Linha da Vida', 'Técnica do belisco', 'Recipientes utilitários', 'Espessura das paredes'] },
  { numero: 4, nome: 'Histórias que nos Aproximam', horas: 4, descricao: 'Narrativas, texturas e histórias compartilhadas em argila.', atividades: ['Memórias orais', 'Placas com rolos e réguas', 'Texturas botânicas e têxteis'] },
  { numero: 5, nome: 'METAmorfose', horas: 4, descricao: 'A escuta de transições e a criação de peças em novas formas.', atividades: ['Escuta sobre transições', 'Rolinho (acordelado)', 'Peças verticalizadas'] },
  { numero: 6, nome: 'Lidando com Problemas', horas: 4, descricao: 'Técnicas de reparo, acabamento e proteção das criações.', atividades: ['Reparo de trincas', 'Lixamento fino', 'Esponjamento', 'Esmaltação protetiva'] },
  { numero: 7, nome: 'Montando Nossa Exposição', horas: 4, descricao: 'Curadoria compartilhada para apresentar as criações ao público.', atividades: ['Curadoria compartilhada', 'Seleção das criações', 'Cartões autorais'] },
  { numero: 8, nome: 'A Exposição', horas: 36, descricao: 'Compartilhamento dos trabalhos com a comunidade em mostras abertas.', atividades: ['Montagem das mostras', 'Mediação acessível', 'Feira e bazar'] },
];

const accessibilitySeeds = [
  {
    titulo: 'Acessibilidade comunicacional',
    descricao: 'Materiais acessíveis e recursos táteis para ampliar a participação e a autonomia.',
    itens: [
      'Apostilas impressas e em Braille',
      'Fonte ampliada, corpo 24',
      'Legendagem das peças em Braille e fonte ampliada',
      'Tarjetas ilustradas de alto contraste',
    ],
  },
  {
    titulo: 'Acessibilidade física',
    descricao: 'Espaços e mobiliário preparados para uma circulação confortável e segura.',
    itens: [
      'Espaços em nível térreo',
      'Rampas normatizadas, piso antiderrapante e corrimãos',
      'Sanitários adaptados',
      'Mobiliário ergonômico para a faixa 60+',
      'Exposições em pavimentos térreos',
    ],
  },
];

const decisionSeeds = [
  { titulo: 'Prazo de Execução', descricao: '10 meses contínuos, de 31/03/2027 a 31/01/2028.', status: 'Resolvido' },
  { titulo: 'Enquadramento Legal', descricao: 'Artigos 1º (incisos I, II, III, IV, VII, VIII) e 3º (incisos II-e, III-d, V-b) da Lei 8.313/1991.', status: 'Resolvido' },
  { titulo: 'Alinhamento da Equipe', descricao: 'Proposta equalizada entre SalicWeb e o projeto pedagógico.', status: 'Resolvido' },
  { titulo: 'Escopo de Acessibilidade', descricao: 'Braille e fonte ampliada, sem intérpretes de Libras.', status: 'Resolvido' },
];

async function seedTable(client, table, rows, columns, projectId) {
  const { rows: existing } = await client.query(`SELECT EXISTS (SELECT 1 FROM ${table} LIMIT 1) AS populated`);
  if (existing[0].populated) return;
  const columnNames = ['projeto_id', ...columns];
  const values = rows.map((row, index) => [projectId, ...columns.map((column) => row[column] ?? null), index]);
  const insertColumns = [...columnNames, 'posicao'];
  const placeholders = values.map((row, rowIndex) => `(${row.map((_, columnIndex) => `$${rowIndex * row.length + columnIndex + 1}`).join(', ')})`).join(', ');
  const parameters = values.flat().map((value) => (Array.isArray(value) ? JSON.stringify(value) : value));
  await client.query(`INSERT INTO ${table} (${insertColumns.join(', ')}) VALUES ${placeholders}`, parameters);
}

export async function seedDatabase(pool) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let project = await client.query('SELECT id FROM projetos ORDER BY id LIMIT 1');
    if (project.rowCount === 0) {
      const columns = Object.keys(projectSeed);
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
      const result = await client.query(
        `INSERT INTO projetos (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`,
        columns.map((column) => (Array.isArray(projectSeed[column]) ? JSON.stringify(projectSeed[column]) : projectSeed[column])),
      );
      project = result;
    }
    const projectId = project.rows[0].id;

    await seedTable(client, 'metricas', metricSeeds, ['id', 'rotulo', 'valor', 'unidade', 'formato', 'detalhe', 'icone'], projectId);
    await seedTable(client, 'cronograma', phaseSeeds, ['nome', 'duracao_meses', 'descricao', 'atividades'], projectId);
    await seedTable(client, 'equipe', teamSeeds, ['nome', 'qualificacao', 'funcao', 'responsabilidades'], projectId);
    await seedTable(client, 'modulos', moduleSeeds, ['numero', 'nome', 'horas', 'descricao', 'atividades'], projectId);
    await seedTable(client, 'acessibilidade', accessibilitySeeds, ['titulo', 'descricao', 'itens'], projectId);
    await seedTable(client, 'decisoes', decisionSeeds, ['titulo', 'descricao', 'status'], projectId);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
