import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../api/http';
import { useAuth } from '../contexts/AuthContext';

type Ticket = {
  id: number;
  title: string;
  status: string;
  due_at: string | null;
  priority: {
    name: string;
  };
  category: {
    name: string;
    department: {
      name: string;
    };
  };
};

export function TicketsPage() {
  const { logout } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  async function handleLogout() {
    await logout();
  }

  useEffect(() => {
    async function loadTickets() {
      const response = await http.get('/tickets');
      setTickets(response.data.tickets.data);
      setLoading(false);
    }

    loadTickets();
  }, []);

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Chamados</h1>
          <p>Lista de chamados registrados no SmartDesk.</p>
        </div>

        <div className="actions">
          <Link to="/tickets/new">Novo chamado</Link>

          <button type="button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      {loading ? (
        <p>Carregando chamados...</p>
      ) : tickets.length === 0 ? (
        <section className="card">
          <p>Nenhum chamado encontrado.</p>
        </section>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Categoria</th>
              <th>SLA</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>
                  <Link to={`/tickets/${ticket.id}`}>{ticket.title}</Link>
                </td>
                <td>{ticket.status}</td>
                <td>{ticket.priority.name}</td>
                <td>
                  {ticket.category.department.name} / {ticket.category.name}
                </td>
                <td>{ticket.due_at ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}