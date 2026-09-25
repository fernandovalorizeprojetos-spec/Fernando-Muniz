import { useEffect, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';

type Metric = {
  id: string;
  label: string;
  value: number;
  unit: string;
  format: 'currency' | 'number' | 'hours' | 'months';
  detail: string;
  icon: string;
};

type Phase = {
  id: number;
  name: string;
  duration_months: number;
  description: string;
  activities: string[];
};

type TeamMember = {
  id: number;
  name: string;
  qualification: string;
  role: string;
  responsibilities: string;
};

type Module = {
  id: number;
  number: number;
  name: string;
  hours: number;
  description: string;
  activities: string[];
};

type InformationBlock = {
  id: number;
  title: string;
  description: string;
  items: string[];
};

type Decision = {
  id: number;
  title: string;
  description: string;
  status: string;
};

type DashboardData = {
  projeto: {
    name: string;
    subtitle: string;
    description: string;
    starts_on: string;
    ends_on: string;
    global_amount: number;
    direct_audience: number;
    hours_workshops: number;
    hours_firings: number;
    contact: string;
  };
  metricas: Metric[];
  cronograma: Phase[];
  equipe: TeamMember[];
  modulos: Module[];
  metodologia: string[];
  acessibilidade: InformationBlock[];
  decisoes: Decision[];
};

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '');
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const number = new Intl.NumberFormat('pt-BR');

async function fetchDashboard(): Promise<DashboardData> {
  const response = await fetch(`${apiUrl}/api/dados`);
  if (!response.ok) throw new Error(`Não foi possível carregar o dashboard (${response.status}).`);
  return response.json() as Promise<DashboardData>;
}

function formatMetric(metric: Metric) {
  if (metric.format === 'currency') return currency.format(metric.value);
  const value = number.format(metric.value);
  if (metric.format === 'hours') return `${value}h`;
  if (metric.format === 'months') return `${value} meses`;
  return value;
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m16-11a4 4 0 0 1 0 8m-3-14a4 4 0 0 1 0 8M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    groups: 'M3 21V8l9-5 9 5v13m-14 0v-7h10v7M2 21h20',
    modules: 'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z',
    time: 'M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    exhibit: 'M3 4h18v13H3zm5 17h8m-4-4v4m-5-8 3-3 2 2 3-4 3 5',
    audience: 'M3 20v-1a7 7 0 0 1 14 0v1m-7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-6a4 4 0 0 1 0 8m2 3a6 6 0 0 1 3 5',
    budget: 'M12 2v20m5-16H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name] || paths.modules} />
    </svg>
  );
}

function SectionHeading({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {note && <p>{note}</p>}
    </div>
  );
}

function Dashboard({ data }: { data: DashboardData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ['projeto', 'Projeto'],
    ['metricas', 'Indicadores'],
    ['graficos', 'Gráficos'],
    ['cronograma', 'Cronograma'],
    ['equipe', 'Equipe'],
    ['formacao', 'Formação'],
    ['acessibilidade', 'Acessibilidade'],
    ['decisoes', 'Decisões'],
  ];

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Modelando Barro, início">
          <span className="brand-mark"><Icon name="modules" /></span>
          <span>SEMENTE FLOR<small>PROJETOS CULTURAIS</small></span>
        </a>
        <button className="menu-toggle" aria-label="Abrir navegação" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navegação principal">
          {links.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <button className="button button-small print-button" onClick={() => window.print()}>Imprimir painel</button>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow light">Cultura, cuidado e transformação</span>
            <h1>{data.projeto.name}</h1>
            <p>{data.projeto.subtitle}</p>
            <a className="button button-light" href="#projeto">Conheça o projeto <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun" />
            <div className="vase vase-back" />
            <div className="vase vase-front"><span /></div>
            <div className="art-leaf leaf-one" /><div className="art-leaf leaf-two" /><div className="art-leaf leaf-three" />
            <span className="art-caption">feito à mão<br />com afeto</span>
          </div>
          <div className="hero-meta"><span>PAINEL DO PROJETO</span><span>LEI FEDERAL DE INCENTIVO À CULTURA · 8.313/1991</span></div>
        </section>

        <section className="content-section overview-section page-width" id="projeto">
          <div className="overview-copy">
            <SectionHeading eyebrow="01 · Visão geral" title="Arte que acolhe, transforma e aproxima." />
            <p className="lead">{data.projeto.description}</p>
            <p>Com gratuidade integral, a iniciativa promove autonomia, convivência e expressão artística em um espaço acessível e acolhedor.</p>
            <div className="project-tags"><span>Inclusão social</span><span>Cerâmica artística</span><span>Mulheres 60+</span></div>
          </div>
          <aside className="fact-card">
            <span className="eyebrow">Ficha técnica</span>
            <h3>Um projeto feito em comunidade</h3>
            <dl>
              <div><dt>Período</dt><dd>31 mar 2027 — 31 jan 2028</dd></div>
              <div><dt>Duração</dt><dd>10 meses</dd></div>
              <div><dt>Valor homologado</dt><dd>{currency.format(data.projeto.global_amount)}</dd></div>
              <div><dt>Realização</dt><dd>Grupo Semente Flor</dd></div>
              <div><dt>Incentivo</dt><dd>Lei Rouanet · Lei 8.313/1991</dd></div>
            </dl>
          </aside>
        </section>

        <section className="metrics-band" id="metricas">
          <div className="page-width">
            <SectionHeading eyebrow="02 · Números que contam" title="O impacto em perspectiva." note="Metas e resultados previstos para o ciclo do projeto." />
            <div className="metric-grid">
              {data.metricas.map((metric, index) => (
                <article className="metric-card" key={metric.id}>
                  <div className="metric-top"><span className="metric-icon"><Icon name={metric.icon} /></span><span className="metric-index">0{index + 1}</span></div>
                  <strong>{formatMetric(metric)}</strong>
                  <h3>{metric.label}</h3>
                  <p>{metric.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section page-width" id="graficos">
          <SectionHeading eyebrow="03 · Distribuição" title="Tempo dedicado a cada etapa." note="Uma jornada de criação, experimentação e partilha." />
          <div className="charts-grid">
            <article className="chart-card">
              <div className="chart-title"><span className="eyebrow">CARGA HORÁRIA</span><h3>Distribuição de Horas do Projeto</h3><p>151 horas entre oficinas e ciclos de queima</p></div>
              {[['Oficinas', data.projeto.hours_workshops, 'terracotta'], ['Queimas', data.projeto.hours_firings, 'amber']].map(([label, value, color]) => (
                <div className="bar-row" key={label}>
                  <div className="bar-label"><span>{label}</span><strong>{value}h</strong></div>
                  <div className="bar-track"><div className={`bar-fill ${color}`} style={{ '--bar-width': `${Number(value) / Math.max(data.projeto.hours_workshops, data.projeto.hours_firings) * 100}%` } as CSSProperties & { '--bar-width': string }} /></div>
                </div>
              ))}
              <div className="chart-total"><span>Total da formação</span><strong>{data.projeto.hours_workshops + data.projeto.hours_firings}h</strong></div>
            </article>
            <article className="chart-card">
              <div className="chart-title"><span className="eyebrow">CICLO DE 10 MESES</span><h3>Duração por Fase Operacional</h3><p>Um percurso contínuo de preparação à prestação de contas</p></div>
              {data.cronograma.map((phase, index) => (
                <div className="duration-row" key={phase.id}>
                  <div className="duration-label"><span className={`phase-dot phase-${index + 1}`} />{phase.name}<strong>{phase.duration_months} meses</strong></div>
                  <div className="duration-track"><div className={`duration-fill phase-${index + 1}`} style={{ '--bar-width': `${phase.duration_months / 10 * 100}%` } as CSSProperties & { '--bar-width': string }} /></div>
                </div>
              ))}
              <div className="chart-total"><span>Duração total</span><strong>{data.cronograma.reduce((sum, phase) => sum + phase.duration_months, 0)} meses</strong></div>
            </article>
          </div>
        </section>

        <section className="timeline-section" id="cronograma">
          <div className="page-width">
            <SectionHeading eyebrow="04 · Caminho do projeto" title="Um percurso em três fases." note="Planejado para que cada etapa prepare a próxima." />
            <div className="timeline">
              {data.cronograma.map((phase, index) => (
                <article className="timeline-item" key={phase.id}>
                  <div className="timeline-marker"><span>0{index + 1}</span></div>
                  <div className="timeline-content">
                    <div className="timeline-title"><div><span className="eyebrow">{phase.duration_months} MESES</span><h3>{phase.name}</h3></div><span className="timeline-range">{index === 0 ? 'Mar — Mai 2027' : index === 1 ? 'Mai — Nov 2027' : 'Dez 2027 — Jan 2028'}</span></div>
                    <p>{phase.description}</p>
                    <ul className="activity-list">{phase.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section page-width" id="equipe">
          <SectionHeading eyebrow="05 · Quem faz acontecer" title="Uma equipe multidisciplinar." note="Experiência técnica, olhar cuidadoso e trabalho em conjunto." />
          <div className="team-grid">
            {data.equipe.map((member, index) => (
              <article className="team-card" key={member.id}>
                <div className={`avatar avatar-${index + 1}`} aria-hidden="true">{member.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
                <span className="eyebrow">{member.role}</span>
                <h3>{member.name}</h3>
                <p className="team-qualification">{member.qualification}</p>
                <p>{member.responsibilities}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="training-section" id="formacao">
          <div className="page-width">
            <SectionHeading eyebrow="06 · Formação" title="Aprender fazendo, no próprio ritmo." note="Oito módulos conectam expressão, técnica e memória." />
            <div className="module-grid">
              {data.modulos.map((module) => (
                <article className="module-card" key={module.id}>
                  <span className="module-number">{String(module.number).padStart(2, '0')}</span>
                  <div className="module-content"><div className="module-heading"><h3>{module.name}</h3><span>{module.hours}h</span></div><p>{module.description}</p><ul>{module.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul></div>
                </article>
              ))}
            </div>
            <div className="methodology">
              <div><span className="eyebrow">METODOLOGIA</span><h3>Cinco momentos em cada encontro</h3></div>
              <ol>{data.metodologia.map((moment, index) => <li key={moment}><span>0{index + 1}</span>{moment}</li>)}</ol>
            </div>
          </div>
        </section>

        <section className="content-section page-width" id="acessibilidade">
          <SectionHeading eyebrow="07 · Acesso para todas" title="Acessibilidade desde o começo." note="Recursos comunicacionais e espaços preparados para acolher." />
          <div className="accessibility-grid">
            {data.acessibilidade.map((block, index) => (
              <article className="accessibility-card" key={block.id}>
                <span className="access-icon"><Icon name={index === 0 ? 'audience' : 'groups'} /></span>
                <span className="eyebrow">{index === 0 ? 'COMUNICAÇÃO' : 'ESPAÇO E MOBILIDADE'}</span>
                <h3>{block.title}</h3><p>{block.description}</p>
                <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
          <p className="accessibility-note">A proposta não prevê intérpretes de Libras. A acessibilidade comunicacional será realizada por Braille e fonte ampliada, em diálogo com a natureza tátil da cerâmica.</p>
        </section>

        <section className="decisions-section" id="decisoes">
          <div className="page-width decisions-layout">
            <div><SectionHeading eyebrow="08 · Acordos do projeto" title="Decisões compartilhadas." note="Pontos consolidados entre o SalicWeb e o projeto pedagógico." /></div>
            <div className="decision-list">
              {data.decisoes.map((decision, index) => (
                <article className="decision-row" key={decision.id}>
                  <span className="decision-number">0{index + 1}</span>
                  <div><h3>{decision.title}</h3><p>{decision.description}</p></div>
                  <span className="status-pill"><span />{decision.status}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-main">
          <div className="footer-brand"><span className="brand-mark"><Icon name="modules" /></span><div><strong>SEMENTE FLOR</strong><p>Modelando Barro, Transformando Vidas II</p></div></div>
          <div className="footer-law"><span className="rouanet-seal">LEI<br /><strong>ROUANET</strong></span><p>Projeto cultural realizado com incentivo da<br /><strong>Lei Federal de Incentivo à Cultura · Lei 8.313/1991</strong></p></div>
          <a href="#inicio">Voltar ao topo ↑</a>
        </div>
        <div className="page-width footer-bottom"><span>31 mar 2027 — 31 jan 2028</span><span>Formação em cerâmica artística e inclusão social</span><span>{data.projeto.contact}</span></div>
      </footer>
    </>
  );
}

const editableSections = [
  ['metricas', 'Métricas'],
  ['cronograma', 'Cronograma'],
  ['equipe', 'Equipe'],
  ['modulos', 'Módulos de formação'],
  ['acessibilidade', 'Acessibilidade'],
  ['decisoes', 'Decisões'],
] as const;

function AdminPanel() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin-token') || '');
  const [data, setData] = useState<DashboardData | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);
    fetch(`${apiUrl}/api/admin/verify`, { headers: { 'x-admin-token': token } })
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 401 ? 'Token administrativo inválido.' : `Não foi possível validar o acesso (${response.status}).`);
        return fetchDashboard();
      })
      .then((result) => {
        if (!active) return;
        setData(result);
        setDrafts(Object.fromEntries(editableSections.map(([key]) => [key, JSON.stringify(result[key as keyof DashboardData], null, 2)])));
        setMessage('');
      })
      .catch((error: Error) => {
        if (!active) return;
        setMessage(error.message);
        if (error.message === 'Token administrativo inválido.') {
          sessionStorage.removeItem('admin-token');
          setToken('');
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const value = String(formData.get('token') || '');
    if (!value) return;
    sessionStorage.setItem('admin-token', value);
    setToken(value);
    setMessage('Token salvo nesta sessão. Se não for válido, a API recusará as alterações.');
  }

  async function saveSection(key: string) {
    let content: unknown;
    try {
      content = JSON.parse(drafts[key] || '');
      if (!Array.isArray(content)) throw new Error('O conteúdo desta seção deve ser uma lista JSON.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'JSON inválido.');
      return;
    }
    setMessage('');
    try {
      const response = await fetch(`${apiUrl}/api/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify(content),
      });
      if (response.status === 401) {
        sessionStorage.removeItem('admin-token');
        setToken('');
        setData(null);
        throw new Error('Token inválido ou expirado. Informe novamente.');
      }
      if (!response.ok) {
        const result = await response.json() as { error?: string };
        throw new Error(result.error || `Falha ao salvar (${response.status}).`);
      }
      const result = await fetchDashboard();
      setData(result);
      setDrafts(Object.fromEntries(editableSections.map(([section]) => [section, JSON.stringify(result[section as keyof DashboardData], null, 2)])));
      setMessage('Alterações salvas. O painel público já está atualizado.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível salvar as alterações.');
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-header"><a className="brand" href="/"><span className="brand-mark"><Icon name="modules" /></span><span>SEMENTE FLOR<small>PAINEL ADMINISTRATIVO</small></span></a><a href="/">← Ver painel público</a></header>
      <div className="admin-content">
        <SectionHeading eyebrow="Área restrita" title="Atualize o conteúdo do projeto." note="Edite os dados de cada seção em JSON. O painel público reflete as alterações após salvar." />
        {!token ? (
          <form className="admin-login" onSubmit={signIn}>
            <label htmlFor="admin-token">Chave de administração</label>
            <input id="admin-token" name="token" type="password" autoComplete="current-password" required placeholder="Informe o ADMIN_TOKEN" />
            <button className="button" type="submit">Acessar editor</button>
          </form>
        ) : loading ? <p>Carregando dados do projeto…</p> : data ? (
          <div className="admin-sections">
            {editableSections.map(([key, label]) => (
              <section className="admin-editor" key={key}>
                <div className="admin-editor-heading"><h2>{label}</h2><button className="button button-small" onClick={() => void saveSection(key)}>Salvar seção</button></div>
                <textarea aria-label={`Dados de ${label} em JSON`} spellCheck={false} value={drafts[key] || ''} onChange={(event) => setDrafts({ ...drafts, [key]: event.target.value })} />
              </section>
            ))}
          </div>
        ) : <p>Os dados não puderam ser carregados. {message}</p>}
        {message && <p className="admin-message" role="status">{message}</p>}
        {token && <button className="text-button" onClick={() => { sessionStorage.removeItem('admin-token'); setToken(''); setData(null); setMessage('Sessão encerrada.'); }}>Encerrar sessão</button>}
      </div>
    </main>
  );
}

function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin';

  useEffect(() => {
    if (isAdmin) return;
    fetchDashboard().then(setData).catch((cause: Error) => setError(cause.message));
  }, [isAdmin]);

  if (isAdmin) return <AdminPanel />;
  if (error) return <main className="load-state"><h1>Não foi possível abrir o painel</h1><p>{error} Verifique se a API está ativa e tente novamente.</p></main>;
  if (!data) return <main className="load-state"><span className="loader" /><p>Carregando o painel do projeto…</p></main>;
  return <Dashboard data={data} />;
}

export default App;
