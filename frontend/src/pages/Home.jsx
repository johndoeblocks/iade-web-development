import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Pizza from '../components/Pizza';
import './Home.css';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Home page - Fetches pizzas from the backend API
 */
function Home() {
  const { addToCart } = useCart();
  const [pizzas, setPizzas] = useState([]);
  const [pizzaDoDia, setPizzaDoDia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch pizzas and pizza of the day in parallel
        const [pizzasRes, pizzaDoDiaRes] = await Promise.all([
          fetch(`${API_URL}/pizzas`),
          fetch(`${API_URL}/pizzas/pizza-of-the-day`)
        ]);

        if (!pizzasRes.ok) throw new Error('Erro ao carregar pizzas');
        if (!pizzaDoDiaRes.ok) throw new Error('Erro ao carregar pizza do dia');

        const pizzasData = await pizzasRes.json();
        const pizzaDoDiaData = await pizzaDoDiaRes.json();

        setPizzas(pizzasData);
        setPizzaDoDia(pizzaDoDiaData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAddToCart = (pizza) => {
    addToCart(pizza);
  };

  if (loading) {
    return (
      <div className="home">
        <section className="hero">
          <div className="hero__content">
            <h1 className="hero__title">
              As Melhores Pizzas<br />
              <span className="hero__title--accent">de Portugal</span>
            </h1>
            <p className="hero__subtitle">A carregar...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <section className="hero">
          <div className="hero__content">
            <h1 className="hero__title">Oops!</h1>
            <p className="hero__subtitle">{error}</p>
          </div>
        </section>
      </div>
    );
  }
  
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            As Melhores Pizzas<br />
            <span className="hero__title--accent">de Portugal</span>
          </h1>
          <p className="hero__subtitle">
            Feitas com ingredientes frescos e muito amor desde 1985
          </p>
        </div>
      </section>
      
      {/* Pizza do Dia */}
      {pizzaDoDia && (
        <section className="pizza-do-dia">
          <div className="pizza-do-dia__container">
            <div className="pizza-do-dia__badge">🌟 Pizza do Dia</div>
            <h2 className="pizza-do-dia__nome">{pizzaDoDia.nome}</h2>
            <p className="pizza-do-dia__descricao">{pizzaDoDia.descricao}</p>
            <div className="pizza-do-dia__preco">
              <span className="pizza-do-dia__preco-original">
                €{pizzaDoDia.precoOriginal.toFixed(2)}
              </span>
              <span className="pizza-do-dia__preco-atual">
                €{pizzaDoDia.preco.toFixed(2)}
              </span>
            </div>
            <button 
              className="pizza-do-dia__btn"
              onClick={() => handleAddToCart(pizzaDoDia)}
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </section>
      )}
      
      {/* Menu */}
      <section className="menu">
        <h2 className="menu__title">O Nosso Menu</h2>
        <div className="menu__grid">
          {pizzas.map(pizza => (
            <Pizza
              key={pizza.id}
              nome={pizza.nome}
              descricao={pizza.descricao}
              preco={pizza.preco}
              imagem={pizza.imagem}
              disponivel={pizza.disponivel}
              onAddToCart={() => handleAddToCart(pizza)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
