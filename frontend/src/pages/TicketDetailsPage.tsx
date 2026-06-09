import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { http } from '../api/http';
import { useAuth } from '../contexts/AuthContext';

type Comment = {
  id: number;
  body: string;
  is_internal: boolean | number;
  created_at: string;
  user: {
    name: string;
    role: string;
  };
};

type Ticket = {
  id: number;
  title: string;
  description: string;
  status: string;
  due_at: string | null;
  resolved_at: string | null;
  priority: {
    name: string;
  };
  category: {
    name: string;
    department: {
      name: string;
    };
  };
  customer: {
    name: string;
    email: string;
  };
  assigned_agent: {
    name: string;
    email: string;
  } | null;
  comments: Comment[];
};

export function TicketDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingComment, setSavingComment] = useState(false);
  const [isInternalComment, setIsInternalComment] = useState(false);

  const canManageTicket = user?.role === 'agent' || user?.role === 'admin';

  async function loadTicket() {
    const response = await http.get(`/tickets/${id}`);
    setTicket(response.data.ticket);
    setLoading(false);
  }

  async function handleAssignTicket() {
    await http.patch(`/tickets/${id}/assign`);
    await loadTicket();
  }

  async function handleStatusChange(status: string) {
    await http.patch(`/tickets/${id}/status`, {
      status,
    });

    await loadTicket();
  }

  async function handleCommentSubmit(event: FormEvent) {
    event.preventDefault();
    setSavingComment(true);

    try {
      await http.post(`/tickets/${id}/comments`, {
        body: comment,
        is_internal: isInternalComment,
      });

      setComment('');
      setIsInternalComment(false);
      await loadTicket();
    } finally {
      setSavingComment(false);
    }
  }

  useEffect(() => {
    loadTicket();
  }, [id]);

  if (loading) {
    return (
      <main className="page">
        <section className="card">
          <p>Carregando chamado...</p>
        </section>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="page">
        <section className="card">
          <p>Chamado não encontrado.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <Link to="/tickets">Voltar</Link>
          <h1>
            #{ticket.id} {ticket.title}
          </h1>
          <p>{ticket.description}</p>
        </div>
      </header>

      <section className="card">
        <p>
          <strong>Status:</strong> {ticket.status}
        </p>
        <p>
          <strong>Prioridade:</strong> {ticket.priority.name}
        </p>
        <p>
          <strong>Categoria:</strong> {ticket.category.department.name} /{' '}
          {ticket.category.name}
        </p>
        <p>
          <strong>SLA:</strong> {ticket.due_at ?? '-'}
        </p>
        <p>
          <strong>Cliente:</strong> {ticket.customer.name}
        </p>
        <p>
          <strong>Atendente:</strong>{' '}
          {ticket.assigned_agent ? ticket.assigned_agent.name : 'Não atribuído'}
        </p>
      </section>

      {canManageTicket && (
        <section className="card">
          <h2>Ações do atendimento</h2>

          <div className="actions">
            <button type="button" onClick={handleAssignTicket}>
              Assumir chamado
            </button>
          </div>

          <label>
            Status
            <select
              value={ticket.status}
              onChange={(event) => handleStatusChange(event.target.value)}
            >
              <option value="open">Aberto</option>
              <option value="in_progress">Em atendimento</option>
              <option value="waiting_customer">Aguardando cliente</option>
              <option value="resolved">Resolvido</option>
              <option value="closed">Fechado</option>
            </select>
          </label>
        </section>
      )}

      <section className="card">
        <h2>Comentários</h2>

        {ticket.comments.length === 0 ? (
          <p>Nenhum comentário ainda.</p>
        ) : (
          ticket.comments.map((item) => (
            <article key={item.id} className="card">
              <strong>{item.user.name}</strong> ({item.user.role})
              {Number(item.is_internal) === 1 && <span> - interno</span>}
              <p>{item.body}</p>
            </article>
          ))
        )}

        <form onSubmit={handleCommentSubmit}>
          <textarea
            required
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            placeholder="Escreva um comentário..."
          />

          {canManageTicket && (
            <label>
              <input
                type="checkbox"
                checked={isInternalComment}
                onChange={(event) => setIsInternalComment(event.target.checked)}
              />
              Comentário interno
            </label>
          )}

          <button type="submit" disabled={savingComment}>
            {savingComment ? 'Enviando...' : 'Adicionar comentário'}
          </button>
        </form>
      </section>
    </main>
  );
}