import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Carrinho.css';

const API_URL = 'http://localhost:3001/api';

/**
 * Carrinho page - Shopping cart with order submission to the backend
 */
function Carrinho() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderData, setOrderData] = useState({ nome: '', telefone: '', morada: '', observacoes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState(null);

  const handleInputChange = (e) => {
    setOrderData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setOrderError(null);

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: orderData.nome,
          telefone: orderData.telefone,
          morada: orderData.morada,
          observacoes: orderData.observacoes,
          items: cart.map(item => ({
            id: item.id,
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao criar encomenda');
      }

      const data = await res.json();
      setOrderSuccess(data.order);
      clearCart();
      setShowCheckout(false);
    } catch (err) {
      console.error('Order error:', err);
      setOrderError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Order success screen
  if (orderSuccess) {
    return (
      <div className="carrinho">
        <section className="carrinho__hero">
          <h1 className="carrinho__title">Encomenda Confirmada!</h1>
        </section>
        <div className="carrinho__empty">
          <span className="carrinho__empty-icon">✅</span>
          <h2>Obrigado, {orderSuccess.nome}!</h2>
          <p>A sua encomenda #{orderSuccess.id} foi recebida.</p>
          <p className="carrinho__order-total">Total: €{orderSuccess.total.toFixed(2)}</p>
          <Link to={`/encomenda/${orderSuccess.id}`} className="carrinho__btn-checkout" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
            📍 Acompanhar Encomenda
          </Link>
          <Link to="/" className="carrinho__btn-voltar">
            Voltar ao Menu
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="carrinho">
        <section className="carrinho__hero">
          <h1 className="carrinho__title">O Seu Carrinho</h1>
        </section>
        <div className="carrinho__empty">
          <span className="carrinho__empty-icon">🛒</span>
          <h2>O seu carrinho está vazio</h2>
          <p>Adicione algumas pizzas deliciosas!</p>
          <Link to="/" className="carrinho__btn-voltar">
            Ver Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="carrinho">
      <section className="carrinho__hero">
        <h1 className="carrinho__title">O Seu Carrinho</h1>
      </section>

      <div className="carrinho__content">
        <div className="carrinho__items">
          {cart.map(item => (
            <div key={item.id} className="carrinho-item">
              <div className="carrinho-item__info">
                <h3 className="carrinho-item__nome">{item.nome}</h3>
                <p className="carrinho-item__preco">€{item.preco.toFixed(2)} cada</p>
              </div>
              <div className="carrinho-item__controls">
                <button
                  className="carrinho-item__qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                >
                  −
                </button>
                <span className="carrinho-item__qty">{item.quantidade}</span>
                <button
                  className="carrinho-item__qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                >
                  +
                </button>
              </div>
              <div className="carrinho-item__subtotal">
                €{(item.preco * item.quantidade).toFixed(2)}
              </div>
              <button
                className="carrinho-item__remove"
                onClick={() => removeFromCart(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="carrinho__summary">
          <div className="carrinho__total">
            <span>Total</span>
            <span className="carrinho__total-value">€{cartTotal.toFixed(2)}</span>
          </div>

          {!showCheckout ? (
            <>
              <button
                className="carrinho__btn-checkout"
                onClick={() => setShowCheckout(true)}
              >
                Finalizar Pedido
              </button>
              <button className="carrinho__btn-clear" onClick={clearCart}>
                Limpar Carrinho
              </button>
            </>
          ) : (
            <form className="checkout-form" onSubmit={handleSubmitOrder}>
              <h3 className="checkout-form__title">Dados de Entrega</h3>
              
              {orderError && (
                <div className="checkout-form__error">{orderError}</div>
              )}

              <div className="checkout-form__field">
                <label htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  placeholder="O seu nome"
                  value={orderData.nome}
                  onChange={handleInputChange}
                />
              </div>

              <div className="checkout-form__field">
                <label htmlFor="telefone">Telefone</label>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  required
                  placeholder="+351 912 345 678"
                  value={orderData.telefone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="checkout-form__field">
                <label htmlFor="morada">Morada</label>
                <input
                  id="morada"
                  name="morada"
                  type="text"
                  required
                  placeholder="A sua morada completa"
                  value={orderData.morada}
                  onChange={handleInputChange}
                />
              </div>

              <div className="checkout-form__field">
                <label htmlFor="observacoes">Observações (opcional)</label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  placeholder="Ex: sem cebola, tocar à campainha..."
                  value={orderData.observacoes}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <button
                type="submit"
                className="carrinho__btn-checkout"
                disabled={submitting}
              >
                {submitting ? 'A enviar...' : 'Confirmar Encomenda'}
              </button>
              <button
                type="button"
                className="carrinho__btn-clear"
                onClick={() => setShowCheckout(false)}
              >
                Voltar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrinho;
