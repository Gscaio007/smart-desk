import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../api/http';

type Category = {
  id: number;
  name: string;
  department: {
    name: string;
  };
};

type Priority = {
  id: number;
  name: string;
};

export function CreateTicketPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [priorityId, setPriorityId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadMetadata() {
      const [categoriesResponse, prioritiesResponse] = await Promise.all([
        http.get('/ticket-categories'),
        http.get('/priorities'),
      ]);

      setCategories(categoriesResponse.data.categories);
      setPriorities(prioritiesResponse.data.priorities);
    }

    loadMetadata();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      await http.post('/tickets', {
        category_id: Number(categoryId),
        priority_id: Number(priorityId),
        title,
        description,
      });

      navigate('/tickets');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>Novo chamado</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Categoria</label>
          <select
            required
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 4 }}
          >
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.department.name} / {category.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Prioridade</label>
          <select
            required
            value={priorityId}
            onChange={(event) => setPriorityId(event.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 4 }}
          >
            <option value="">Selecione</option>
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Título</label>
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Descrição</label>
          <textarea
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            style={{ width: '100%', padding: 10, marginTop: 4 }}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar chamado'}
        </button>

        <button type="button" onClick={() => navigate('/tickets')} style={{ marginLeft: 8 }}>
          Cancelar
        </button>
      </form>
    </main>
  );
}