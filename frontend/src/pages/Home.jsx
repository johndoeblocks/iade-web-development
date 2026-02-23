import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Pizza from '../components/Pizza';
import usePizzaOfTheDay from '../hooks/usePizzaOfTheDay';
import './Home.css';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Home page - Fetches pizzas from the backend API
 */
function Home() {
  const { addToCart } = useCart();
  const [pizzas, setPizzas] = useState([]);
  const { pizza: pizzaDoDia } = usePizzaOfTheDay();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoria = searchParams.get('categoria') || '';
  const [categories, setCategories] = useState([]);

  const handleCategoriaChange = (e) => {
    const v = e.target.value;
    if (v) setSearchParams({ categoria: v }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  // Fetch categories on mount (derive from full pizzas list)
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/pizzas`);
        if (!res.ok) throw new Error('Erro ao carregar pizzas');
        const allPizzas = await res.json();
        const unique = Array.from(new Set(allPizzas.map(p => p.categoria).filter(Boolean)));
        setCategories(unique);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleAddToCart = (pizza) => addToCart(pizza);

  // Fetch pizzas when `categoria` changes
  useEffect(() => {
    async function fetchPizzas() {
      try {
        setLoading(true);
        const url = new URL(`${API_URL}/pizzas`);
        if (categoria) url.searchParams.set('categoria', categoria);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Erro ao carregar pizzas');
        const pizzasData = await res.json();
        setPizzas(pizzasData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPizzas();
  }, [categoria]);

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
        <div className="menu__controls">
          <label htmlFor="categoria-select" className="menu__label">Categoria:</label>
          <select
            id="categoria-select"
            className="menu__select"
            value={categoria}
            onChange={handleCategoriaChange}
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

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
