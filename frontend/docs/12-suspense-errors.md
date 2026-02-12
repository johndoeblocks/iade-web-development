# 12 - Suspense e Error Boundaries

## 🎯 Objetivos
- Melhorar UX com loading states elegantes
- Tratar erros graciosamente
- Usar Suspense e Error Boundaries

---

## ⏳ O Problema: Loading States

Código tradicional fica cheio de condicionais:

```jsx
function App() {
  const [pizzas, setPizzas] = useState([]);
  const [stores, setStores] = useState([]);
  const [pizzasLoading, setPizzasLoading] = useState(true);
  const [storesLoading, setStoresLoading] = useState(true);
  const [pizzasError, setPizzasError] = useState(null);
  const [storesError, setStoresError] = useState(null);
  
  // Muitos estados para gerir! 😫
  
  if (pizzasLoading || storesLoading) return <Spinner />;
  if (pizzasError) return <Error message={pizzasError} />;
  if (storesError) return <Error message={storesError} />;
  
  // ...
}
```

---

## ✨ Suspense - Loading Elegante

Suspense permite declarar um fallback enquanto componentes carregam:

```jsx
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PizzasList />
    </Suspense>
  );
}
```

### Com React.lazy (Code Splitting)
```jsx
const Carrinho = React.lazy(() => import('./pages/Carrinho'));
const Lojas = React.lazy(() => import('./pages/Lojas'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/lojas" element={<Lojas />} />
      </Routes>
    </Suspense>
  );
}
```

### Múltiplos Suspense Boundaries
```jsx
function App() {
  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      
      <main>
        <Suspense fallback={<PizzasSkeleton />}>
          <PizzasList />
        </Suspense>
        
        <Suspense fallback={<PizzaDoDiaSkeleton />}>
          <PizzaDoDia />
        </Suspense>
      </main>
    </div>
  );
}
```

---

## 💥 Error Boundaries - Tratar Erros

Error Boundaries apanham erros JavaScript em componentes filhos.

### Criar Error Boundary
```jsx
// components/ErrorBoundary.jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Logs para serviço de monitorização
    console.error('Error caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>Algo correu mal 😕</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Tentar novamente
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Usar Error Boundary
```jsx
function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Suspense fallback={<Spinner />}>
        <PizzasList />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

## 🔄 Combinar Suspense + Error Boundary

```jsx
// components/AsyncBoundary.jsx
function AsyncBoundary({ children, loadingFallback, errorFallback }) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Uso
<AsyncBoundary
  loadingFallback={<PizzasSkeleton />}
  errorFallback={<ErrorCard message="Não foi possível carregar pizzas" />}
>
  <PizzasList />
</AsyncBoundary>
```

---

## 🎨 Skeleton Loading

```jsx
// components/PizzaCardSkeleton.jsx
function PizzaCardSkeleton() {
  return (
    <div className="pizza-card skeleton">
      <div className="skeleton-image" />
      <div className="skeleton-title" />
      <div className="skeleton-text" />
      <div className="skeleton-price" />
    </div>
  );
}

function PizzasSkeleton() {
  return (
    <div className="pizzas-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <PizzaCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
}

.skeleton-title {
  height: 24px;
  width: 70%;
  margin: 16px 0 8px;
  border-radius: 4px;
}

.skeleton-text {
  height: 16px;
  width: 90%;
  border-radius: 4px;
}

.skeleton-price {
  height: 20px;
  width: 40%;
  margin-top: 12px;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## 🛡️ Fallbacks Específicos

```jsx
function PizzaErrorFallback({ error, resetError }) {
  return (
    <div className="error-card">
      <span className="error-icon">🍕❌</span>
      <h3>Não conseguimos carregar as pizzas</h3>
      <p>{error.message}</p>
      <button onClick={resetError}>
        Tentar novamente
      </button>
    </div>
  );
}

function StoresErrorFallback({ error, resetError }) {
  return (
    <div className="error-card">
      <span className="error-icon">🏪❌</span>
      <h3>Não conseguimos carregar as lojas</h3>
      <button onClick={resetError}>
        Tentar novamente
      </button>
    </div>
  );
}
```

---

## 🧪 Exercício

1. Adiciona Suspense à app com fallback de skeleton
2. Cria Error Boundary customizado
3. Adiciona Error Boundary em volta das rotas
4. Cria componentes skeleton para pizzas e lojas
5. Testa forçando um erro (throw new Error)

---

## 📚 Recursos
- [React - Suspense](https://react.dev/reference/react/Suspense)
- [React - Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [React - lazy](https://react.dev/reference/react/lazy)
