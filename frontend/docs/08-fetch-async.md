# 08 - Fetch e Async/Await

## 🎯 Objetivos
- Usar fetch API corretamente
- Implementar try/catch para erros
- Gerir estados de loading e error
- Boas práticas para data fetching

---

## 🌐 Fetch API

`fetch` é a API nativa do browser para fazer pedidos HTTP.

```javascript
// GET simples
const response = await fetch('https://api.exemplo.com/pizzas');
const data = await response.json();

// POST com dados
const response = await fetch('https://api.exemplo.com/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ pizza: 'Margherita', quantidade: 2 }),
});
```

---

## ⚠️ Try/Catch - Tratamento de Erros

```javascript
async function fetchPizzas() {
  try {
    const response = await fetch('/api/pizzas');
    
    // fetch não lança erro para status 4xx/5xx!
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    // Erros de rede, parsing JSON, ou os que lançamos
    console.error('Erro ao buscar pizzas:', error.message);
    throw error; // Re-lança para quem chamou tratar
  }
}
```

---

## 🔄 O Padrão Loading/Error/Data

```jsx
function ListaPizzas() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/pizzas');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar pizzas');
        }
        
        const data = await response.json();
        setPizzas(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Renderização baseada no estado
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="error">
        <p>❌ {error}</p>
        <button onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </div>
    );
  }
  
  if (pizzas.length === 0) {
    return <p>Nenhuma pizza encontrada.</p>;
  }
  
  return (
    <div className="pizzas-grid">
      {pizzas.map(pizza => (
        <PizzaCard key={pizza.id} pizza={pizza} />
      ))}
    </div>
  );
}
```

---

## 🛡️ Defensivo: Verificando Dados

```jsx
useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch('/api/pizzas');
      const data = await response.json();
      
      // Verificar se é array
      if (!Array.isArray(data)) {
        throw new Error('Formato de dados inesperado');
      }
      
      // Verificar estrutura de cada item
      const validPizzas = data.filter(pizza => 
        pizza.id && pizza.nome && typeof pizza.preco === 'number'
      );
      
      setPizzas(validPizzas);
      
    } catch (err) {
      setError(err.message);
    }
  }
  
  fetchData();
}, []);
```

---

## 🔄 POST - Enviar Dados

```jsx
function FormularioEncomenda() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao submeter');
      }
      
      const result = await response.json();
      console.log('Encomenda criada:', result);
      
      // Redirecionar ou mostrar sucesso
      navigate('/confirmacao');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'A enviar...' : 'Fazer Encomenda'}
      </button>
    </form>
  );
}
```

---

## 🎨 Loading States Bonitos

```jsx
// Skeleton Loading
function PizzaCardSkeleton() {
  return (
    <div className="pizza-card skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
    </div>
  );
}

function ListaPizzas() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return (
      <div className="pizzas-grid">
        {[1, 2, 3, 4, 5, 6].map(n => (
          <PizzaCardSkeleton key={n} />
        ))}
      </div>
    );
  }
  
  // ...
}
```

```css
/* Animação skeleton */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## 🔁 Retry Logic

```jsx
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Espera exponencial: 1s, 2s, 4s...
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
}
```

---

## 🧪 Exercício

1. Cria um componente que busca e mostra as lojas
2. Implementa loading state com skeleton
3. Implementa error state com botão retry
4. Adiciona um formulário que faz POST para criar encomenda

---

## 📚 Recursos
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN - Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
