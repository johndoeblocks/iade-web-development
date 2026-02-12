import './Pizza.css';

/**
 * Componente Pizza - Mostra uma pizza individual
 * 
 * @example
 * <Pizza 
 *   nome="Margherita" 
 *   descricao="Molho de tomate..." 
 *   preco={8.50} 
 *   imagem="/pizzas/margherita.jpg"
 *   onAddToCart={() => console.log('Added!')}
 * />
 */
function Pizza({ nome, descricao, preco, imagem, disponivel = true, onAddToCart }) {
  return (
    <div className={`pizza-card ${!disponivel ? 'pizza-card--indisponivel' : ''}`}>
      <div className="pizza-card__image">
        <img src={imagem} alt={nome} />
        {!disponivel && <span className="pizza-card__badge">Indisponível</span>}
      </div>
      <div className="pizza-card__content">
        <h3 className="pizza-card__nome">{nome}</h3>
        <p className="pizza-card__descricao">{descricao}</p>
        <div className="pizza-card__footer">
          <span className="pizza-card__preco">€{preco.toFixed(2)}</span>
          <button 
            className="pizza-card__btn"
            onClick={onAddToCart}
            disabled={!disponivel}
          >
            {disponivel ? 'Adicionar' : 'Indisponível'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pizza;