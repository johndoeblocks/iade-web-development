# 09 - Custom Hooks

## 🎯 Objetivos
- Entender quando criar custom hooks
- Extrair lógica reutilizável
- Criar hooks para a pizzaria

---

## 🤔 O Que São Custom Hooks?

Custom hooks são funções que:
1. Começam com `use`
2. Podem usar outros hooks
3. Encapsulam lógica reutilizável

```jsx
// Antes: Lógica duplicada em vários componentes
function ComponenteA() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('/api/pizzas')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  // ...
}

// Depois: Reutilizar com custom hook
function ComponenteA() {
  const { data, loading, error } = useFetch('/api/pizzas');
  // ...
}
```

---

## 🛠️ Criar um Custom Hook: useFetch

```jsx
// hooks/useFetch.js
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const json = await response.json();
        setData(json);
        
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    
    return () => controller.abort();
  }, [url]);
  
  return { data, loading, error };
}
```

### Uso
```jsx
function ListaPizzas() {
  const { data: pizzas, loading, error } = useFetch('/api/pizzas');
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  
  return pizzas.map(pizza => <PizzaCard key={pizza.id} {...pizza} />);
}
```

---

## 🍕 usePizzaOfTheDay

Hook específico para a pizza do dia:

```jsx
// hooks/usePizzaOfTheDay.js
import { useState, useEffect } from 'react';

export function usePizzaOfTheDay() {
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchPizza() {
      try {
        const response = await fetch('/api/pizza-of-the-day');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setPizza(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPizza();
  }, []);
  
  return { pizza, loading, error };
}
```

### Uso
```jsx
function Header() {
  const { pizza, loading } = usePizzaOfTheDay();
  
  return (
    <header>
      <h1>Padre Gino's</h1>
      {!loading && pizza && (
        <div className="promo">
          🌟 Hoje: {pizza.nome} - €{pizza.preco.toFixed(2)}
        </div>
      )}
    </header>
  );
}
```

---

## 🛒 useCart

Hook para gerir o carrinho:

```jsx
// hooks/useCart.js
import { useState, useCallback } from 'react';

export function useCart() {
  const [items, setItems] = useState([]);
  
  const addToCart = useCallback((pizza) => {
    setItems(current => {
      const existing = current.find(item => item.id === pizza.id);
      
      if (existing) {
        return current.map(item =>
          item.id === pizza.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...current, { ...pizza, quantity: 1 }];
    });
  }, []);
  
  const removeFromCart = useCallback((pizzaId) => {
    setItems(current => current.filter(item => item.id !== pizzaId));
  }, []);
  
  const updateQuantity = useCallback((pizzaId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(pizzaId);
    }
    
    setItems(current =>
      current.map(item =>
        item.id === pizzaId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);
  
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);
  
  // Valores derivados
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
```

---

## 💾 useLocalStorage

Persistir dados no localStorage:

```jsx
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Inicializa com valor do localStorage ou default
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  // Atualiza localStorage quando valor muda
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [key, value]);
  
  return [value, setValue];
}
```

### Uso
```jsx
function App() {
  const [cart, setCart] = useLocalStorage('padre-ginos-cart', []);
  // Carrinho persiste entre sessões!
}
```

---

## 📋 Regras para Custom Hooks

1. **Começar com `use`** - obrigatório
2. **Composição** - podem usar outros hooks
3. **Isolamento** - cada uso tem seu próprio estado
4. **Sem UI** - retornam dados, não JSX

```jsx
// ✅ Cada componente tem seu próprio contador
function Contador1() {
  const [count, setCount] = useCounter(); // Estado independente
}

function Contador2() {
  const [count, setCount] = useCounter(); // Estado independente
}
```

---

## 🧪 Exercício

1. Cria `usePizzas()` que busca todas as pizzas
2. Cria `useStores()` que busca as lojas
3. Usa `useLocalStorage` para persistir o carrinho
4. Cria `useToggle(initial)` para valores boolean

---

## 📚 Recursos
- [React - Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
