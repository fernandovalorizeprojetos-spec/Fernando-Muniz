import { dashboardSectionTypes } from './types/domain';

function App() {
  return (
    <main className="shell">
      <section className="hero">
        <span className="eyebrow">Fundação da plataforma</span>
        <h1>Dashboards de projetos</h1>
        <p>
          A base técnica está pronta para clientes, projetos, permissões e dashboards
          orientados por templates.
        </p>
        <div className="template-card">
          <strong>Template inicial</strong>
          <h2>Projeto Cultural</h2>
          <ul>
            {dashboardSectionTypes.map((section) => <li key={section}>{section}</li>)}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default App;
