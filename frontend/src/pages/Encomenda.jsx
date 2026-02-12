import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Encomenda.css';

const API_URL = 'http://localhost:3001/api';

const STATUS_STEPS = [
  { key: 'pendente', emoji: '🕐', label: 'Pendente' },
  { key: 'em preparação', emoji: '👨‍🍳', label: 'Em Preparação' },
  { key: 'a caminho', emoji: '🛵', label: 'A Caminho' },
  { key: 'entregue', emoji: '✅', label: 'Entregue' },
];

function getStepIndex(status) {
  if (status === 'cancelado') return -1;
  return STATUS_STEPS.findIndex(s => s.key === status);
}

/**
 * Encomenda page - Customer order tracking
 */
function Encomenda() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchOrder() {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`);
      if (!res.ok) throw new Error('Encomenda não encontrada');
      const data = await res.json();
      setOrder(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrder();

    // Poll every 3 seconds to get live updates
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="encomenda">
        <section className="encomenda__hero">
          <h1 className="encomenda__title">Acompanhar Encomenda</h1>
          <p className="encomenda__subtitle">A carregar...</p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="encomenda">
        <section className="encomenda__hero">
          <h1 className="encomenda__title">Encomenda #{id}</h1>
          <p className="encomenda__subtitle">{error}</p>
        </section>
        <div className="encomenda__content">
          <Link to="/" className="encomenda__back-btn">← Voltar ao Menu</Link>
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelado';

  return (
    <div className="encomenda">
      <section className="encomenda__hero">
        <h1 className="encomenda__title">Encomenda #{order.id}</h1>
        <p className="encomenda__subtitle">
          {isCancelled ? '❌ Esta encomenda foi cancelada' : 'Acompanhe o estado da sua encomenda em tempo real'}
        </p>
      </section>

      <div className="encomenda__content">
        {/* Status tracker */}
        {!isCancelled ? (
          <div className="tracker">
            <div className="tracker__steps">
              {STATUS_STEPS.map((step, index) => (
                <div
                  key={step.key}
                  className={`tracker__step 
                    ${index <= currentStep ? 'tracker__step--done' : ''} 
                    ${index === currentStep ? 'tracker__step--current' : ''}
                  `}
                >
                  <div className="tracker__step-icon">{step.emoji}</div>
                  <div className="tracker__step-label">{step.label}</div>
                  {index < STATUS_STEPS.length - 1 && (
                    <div className={`tracker__connector ${index < currentStep ? 'tracker__connector--done' : ''}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="tracker tracker--cancelled">
            <div className="tracker__cancelled-icon">❌</div>
            <p className="tracker__cancelled-text">Encomenda Cancelada</p>
          </div>
        )}

        {/* Order details */}
        <div className="encomenda__details">
          <h2 className="encomenda__details-title">Detalhes</h2>
          
          <div className="encomenda__info-grid">
            <div className="encomenda__info-item">
              <span className="encomenda__info-label">👤 Nome</span>
              <span className="encomenda__info-value">{order.nome}</span>
            </div>
            <div className="encomenda__info-item">
              <span className="encomenda__info-label">📞 Telefone</span>
              <span className="encomenda__info-value">{order.telefone}</span>
            </div>
            <div className="encomenda__info-item">
              <span className="encomenda__info-label">📍 Morada</span>
              <span className="encomenda__info-value">{order.morada}</span>
            </div>
            <div className="encomenda__info-item">
              <span className="encomenda__info-label">📅 Data</span>
              <span className="encomenda__info-value">
                {new Date(order.createdAt).toLocaleString('pt-PT')}
              </span>
            </div>
          </div>

          <h3 className="encomenda__items-title">Itens</h3>
          <div className="encomenda__items-list">
            {order.items.map((item, i) => (
              <div key={i} className="encomenda__item-row">
                <span>{item.quantidade}x {item.nome}</span>
                <span>€{(item.preco * item.quantidade).toFixed(2)}</span>
              </div>
            ))}
            <div className="encomenda__item-row encomenda__item-row--total">
              <span>Total</span>
              <span>€{order.total.toFixed(2)}</span>
            </div>
          </div>

          {order.observacoes && (
            <p className="encomenda__obs">📝 {order.observacoes}</p>
          )}
        </div>

        <Link to="/" className="encomenda__back-btn">← Voltar ao Menu</Link>
      </div>
    </div>
  );
}

export default Encomenda;
