# 11 - Context API

## 🎯 Objetivos
- Entender o problema do prop drilling
- Usar Context para estado global
- Criar CartContext para a pizzaria
- Boas práticas de Context

---

## 😫 O Problema: Prop Drilling

Passar props através de muitos níveis de componentes:

```jsx
// App → Layout → Main → Section → List → Item → Button
// Temos de passar `carrinho` por TODOS!

function App() {
  const [carrinho, setCarrinho] = useState([]);
  return <Layout carrinho={carrinho} setCarrinho={setCarrinho} />;
}

function Layout({ carrinho, setCarrinho }) {
  return <Main carrinho={carrinho} setCarrinho={setCarrinho} />;
}

function Main({ carrinho, setCarrinho }) {
  return <Section carrinho={carrinho} setCarrinho={setCarrinho} />;
}
// ... e assim por diante 😩
```

---

## ✨ A Solução: Context

Context permite "teleportar" dados para qualquer componente:

```
App (Provider)
  └── Layout
        └── Main
              └── Section
                    └── Button (Consumer) ← Acede diretamente!
```

---

## 🛠️ Criar Context

### 1. Criar o Context
```jsx
// context/CartContext.jsx
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  
  const addToCart = (pizza) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === pizza.id);
      if (existing) {
        return prev.map(i =>
          i.id === pizza.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...pizza, quantity: 1 }];
    });
  };
  
  const removeFromCart = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };
  
  const clearCart = () => setItems([]);
  
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.preco * i.quantity, 
    0
  );
  
  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook customizado para usar o context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
}
```

### 2. Envolver a App
```jsx
// main.jsx
import { CartProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <CartProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CartProvider>
);
```

### 3. Usar em Qualquer Componente
```jsx
// Header.jsx
import { useCart } from '../context/CartContext';

function Header() {
  const { totalItems } = useCart();
  
  return (
    <header>
      <Link to="/carrinho">
        🛒 ({totalItems})
      </Link>
    </header>
  );
}

// PizzaCard.jsx
function PizzaCard({ pizza }) {
  const { addToCart } = useCart();
  
  return (
    <div className="pizza-card">
      <h3>{pizza.nome}</h3>
      <button onClick={() => addToCart(pizza)}>
        Adicionar
      </button>
    </div>
  );
}

// Carrinho.jsx
function Carrinho() {
  const { items, totalPrice, removeFromCart, clearCart } = useCart();
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.nome} x{item.quantity}
          <button onClick={() => removeFromCart(item.id)}>X</button>
        </div>
      ))}
      <p>Total: €{totalPrice.toFixed(2)}</p>
      <button onClick={clearCart}>Limpar</button>
    </div>
  );
}
```

---

## 📦 Múltiplos Contexts

```jsx
// Separar por domínio
<AuthProvider>
  <CartProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </CartProvider>
</AuthProvider>

// Usar
const { user } = useAuth();
const { items } = useCart();
const { theme } = useTheme();
```

---

## ⚡ Performance

Context re-renderiza **todos** os consumidores quando o valor muda.

### Problema
```jsx
// ❌ Objeto novo a cada render = re-render de tudo
<CartContext.Provider value={{ items, addToCart, removeFromCart }}>
```

### Solução com useMemo
```jsx
// ✅ Memoizar o valor
const value = useMemo(() => ({
  items,
  addToCart,
  removeFromCart,
}), [items]); // addToCart e removeFromCart com useCallback

<CartContext.Provider value={value}>
```

---

## 🆚 Quando Usar Context?

| ✅ Usar Context | ❌ Não Usar |
|-----------------|-------------|
| Tema (dark/light) | Props para 1-2 níveis |
| Autenticação | Estado local de componente |
| Carrinho | Dados que mudam muito rápido |
| Idioma | Tudo (overuse) |

---

## 🏪 StoresContext Exemplo

```jsx
// context/StoresContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const StoresContext = createContext();

export function StoresProvider({ children }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  
  useEffect(() => {
    fetch('/api/stores')
      .then(res => res.json())
      .then(data => {
        setStores(data);
        setLoading(false);
      });
  }, []);
  
  return (
    <StoresContext.Provider value={{
      stores,
      loading,
      selectedStore,
      setSelectedStore,
    }}>
      {children}
    </StoresContext.Provider>
  );
}

export const useStores = () => useContext(StoresContext);
```

---

## 🧪 Exercício

1. Cria `CartContext` com add/remove/clear
2. Mostra contador no header
3. Cria página de carrinho
4. Cria `StoresContext` para as lojas
5. Permite selecionar loja de entrega

---

## 📚 Recursos
- [React - Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React - useContext](https://react.dev/reference/react/useContext)
