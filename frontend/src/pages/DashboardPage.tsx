import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../api/http';

type Dashboard = {
  total: number;
  open: number;
  in_progress: number;
  waiting_customer: number;
  overdue: number;
  resolved: number;
  closed: number;
};

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      const response = await http.get('/dashboard');
      setDashboard(response.data);
    }

    loadDashboard();
  }, []);

  if (!dashboard) {
    return (
      <main style={{ maxWidth: 960, margin: '40px auto', fontFamily: 'Arial' }}>
        <p>Carregando dashboard...</p>
      </main>
    );
  }

  const cards = [
    ['Total', dashboard.total],
    ['Abertos', dashboard.open],
    ['Em atendimento', dashboard.in_progress],
    ['Aguardando cliente', dashboard.waiting_customer],
    ['Vencidos', dashboard.overdue],
    ['Resolvidos', dashboard.resolved],
    ['Fechados', dashboard.closed],
  ];

  return (
    <main style={{ maxWidth: 960, margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>Dashboard</h1>

      <nav style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <Link to="/tickets">Chamados</Link>
        <Link to="/tickets/new">Novo chamado</Link>
      </nav>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
      >
        {cards.map(([label, value]) => (
          <article key={label} style={{ border: '1px solid #ccc', padding: 16 }}>
            <strong>{label}</strong>
            <p style={{ fontSize: 32, margin: '8px 0 0' }}>{value}</p>
          </article>
        ))}
      </section>
    </main>
  );
}