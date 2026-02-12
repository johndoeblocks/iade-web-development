# 07 - useEffect

## 🎯 Objetivos
- Entender efeitos secundários
- Dominar o array de dependências
- Implementar cleanup corretamente
- Evitar erros comuns

---

## 🔄 O Que São Efeitos Secundários?

Efeitos são coisas que acontecem **fora** do fluxo de renderização:

- Buscar dados de uma API
- Subscrever a eventos
- Manipular o DOM diretamente
- Timers (setTimeout, setInterval)
- Logging

---

## 📦 Sintaxe Básica

```jsx
import { useEffect } from 'react';

function Componente() {
  useEffect(() => {
    // Código do efeito
    console.log('Componente renderizou!');
  });
  
  return <div>...</div>;
}
```

---

## 📋 Array de Dependências

O segundo argumento controla **quando** o efeito executa:

### Sem Array - Executa Sempre
```jsx
useEffect(() => {
  console.log('Executa em CADA renderização');
});
```

### Array Vazio - Só no Mount
```jsx
useEffect(() => {
  console.log('Executa SÓ quando o componente aparece');
}, []);
```

### Com Dependências - Quando Mudam
```jsx
useEffect(() => {
  console.log(`O userId mudou para: ${userId}`);
}, [userId]);
```

---

## 🔍 Exemplo: Fetch de Dados

```jsx
function PizzasList() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchPizzas() {
      try {
        setLoading(true);
        const response = await fetch('/api/pizzas');
        const data = await response.json();
        setPizzas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPizzas();
  }, []); // Array vazio = só no mount
  
  if (loading) return <p>A carregar...</p>;
  if (error) return <p>Erro: {error}</p>;
  
  return (
    <ul>
      {pizzas.map(pizza => (
        <li key={pizza.id}>{pizza.nome}</li>
      ))}
    </ul>
  );
}
```

---

## 🧹 Cleanup Function

Retorna uma função para **limpar** quando o componente desmonta ou antes do próximo efeito:

```jsx
useEffect(() => {
  // Setup
  const interval = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  // Cleanup
  return () => {
    clearInterval(interval);
  };
}, []);
```

### Exemplo: Event Listener
```jsx
useEffect(() => {
  const handleResize = () => {
    console.log('Window resized:', window.innerWidth);
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

### Exemplo: Abort Fetch
```jsx
useEffect(() => {
  const controller = new AbortController();
  
  async function fetchData() {
    try {
      const response = await fetch('/api/pizzas', {
        signal: controller.signal
      });
      const data = await response.json();
      setPizzas(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    }
  }
  
  fetchData();
  
  return () => {
    controller.abort(); // Cancela fetch se componente desmonta
  };
}, []);
```

---

## ⚠️ Erros Comuns

### 1. Dependências em Falta
```jsx
// ❌ userId pode mudar mas efeito não re-executa
useEffect(() => {
  fetch(`/api/user/${userId}`);
}, []);

// ✅ Adiciona a dependência
useEffect(() => {
  fetch(`/api/user/${userId}`);
}, [userId]);
```

### 2. Objeto nas Dependências
```jsx
// ❌ Objeto é recriado a cada render = loop infinito!
const options = { limit: 10 };
useEffect(() => {
  fetch('/api/pizzas', options);
}, [options]);

// ✅ Usa useMemo ou move para fora
const options = useMemo(() => ({ limit: 10 }), []);
useEffect(() => {
  fetch('/api/pizzas', options);
}, [options]);
```

### 3. Async Direto
```jsx
// ❌ useEffect não pode ser async
useEffect(async () => {
  const data = await fetch('/api/pizzas');
}, []);

// ✅ Define função async dentro
useEffect(() => {
  async function fetchData() {
    const data = await fetch('/api/pizzas');
  }
  fetchData();
}, []);
```

---

## 🎯 Pizza do Dia - Exemplo Completo

```jsx
function PizzaDoDia() {
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchPizzaDoDia() {
      try {
        const res = await fetch('/api/pizza-of-the-day', {
          signal: controller.signal
        });
        const data = await res.json();
        setPizza(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchPizzaDoDia();
    
    return () => controller.abort();
  }, []);
  
  if (loading) return <div className="skeleton">...</div>;
  if (!pizza) return null;
  
  return (
    <div className="pizza-do-dia">
      <h2>🍕 Pizza do Dia</h2>
      <img src={pizza.imagem} alt={pizza.nome} />
      <h3>{pizza.nome}</h3>
      <p>{pizza.descricao}</p>
      <p className="preco">€{pizza.preco.toFixed(2)}</p>
    </div>
  );
}
```

---

## 🧪 Exercício

1. Cria um componente que busca pizzas da API
2. Adiciona estados de loading e error
3. Implementa cleanup com AbortController
4. Adiciona um filtro por categoria (dependência)

---

## 📚 Recursos
- [React - useEffect](https://react.dev/reference/react/useEffect)
- [React - Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
