# 04 - React Router

## 🎯 Objetivos
- Implementar navegação SPA (Single Page Application)
- Criar rotas com React Router
- Usar parâmetros e query strings
- Navegação programática

---

## 🛣️ O Que é Routing?

Em SPAs, não carregamos páginas novas - **alteramos o que é renderizado** baseado na URL.

```
/           → Página inicial (lista de pizzas)
/carrinho   → Carrinho de compras
/lojas      → Lista de lojas
/loja/1     → Detalhes da loja 1
```

---

## 📦 Instalação

```bash
npm install react-router-dom
```

---

## 🔧 Configuração Básica

```jsx
// main.jsx
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Carrinho from './pages/Carrinho';
import Lojas from './pages/Lojas';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/lojas" element={<Lojas />} />
      </Routes>
    </div>
  );
}
```

---

## 🔗 Navegação com Link

```jsx
import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <nav>
      {/* Link básico */}
      <Link to="/">Home</Link>
      
      {/* NavLink - adiciona classe quando ativo */}
      <NavLink 
        to="/carrinho"
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Carrinho
      </NavLink>
    </nav>
  );
}
```

> ⚠️ Nunca uses `<a href="">` para navegação interna! Quebra a SPA.

---

## 📝 Parâmetros de Rota

```jsx
// Definir rota com parâmetro
<Route path="/loja/:lojaId" element={<LojaDetalhe />} />
<Route path="/pizza/:pizzaId" element={<PizzaDetalhe />} />

// Aceder ao parâmetro
import { useParams } from 'react-router-dom';

function LojaDetalhe() {
  const { lojaId } = useParams();
  
  return <h1>Loja #{lojaId}</h1>;
}
```

---

## 🔍 Query Strings

```jsx
// URL: /lojas?cidade=lisboa&aberto=true

import { useSearchParams } from 'react-router-dom';

function Lojas() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const cidade = searchParams.get('cidade'); // 'lisboa'
  const aberto = searchParams.get('aberto'); // 'true'
  
  // Atualizar query string
  const filtrarPorCidade = (novaCidade) => {
    setSearchParams({ cidade: novaCidade });
  };
  
  return (
    <div>
      <button onClick={() => filtrarPorCidade('porto')}>
        Ver Porto
      </button>
    </div>
  );
}
```

---

## 🚀 Navegação Programática

```jsx
import { useNavigate } from 'react-router-dom';

function PizzaCard({ pizza }) {
  const navigate = useNavigate();
  
  const adicionarEIrParaCarrinho = () => {
    // Adicionar ao carrinho...
    navigate('/carrinho');
  };
  
  const voltarAtras = () => {
    navigate(-1); // Volta à página anterior
  };
  
  return (
    <div>
      <button onClick={adicionarEIrParaCarrinho}>
        Adicionar e Ver Carrinho
      </button>
      <button onClick={voltarAtras}>Voltar</button>
    </div>
  );
}
```

---

## 🚫 Página 404

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/carrinho" element={<Carrinho />} />
  
  {/* Catch-all para 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## 📂 Rotas Aninhadas

```jsx
// App.jsx
<Routes>
  <Route path="/lojas" element={<LojasLayout />}>
    <Route index element={<ListaLojas />} />
    <Route path=":lojaId" element={<LojaDetalhe />} />
  </Route>
</Routes>

// LojasLayout.jsx
import { Outlet } from 'react-router-dom';

function LojasLayout() {
  return (
    <div>
      <h1>Nossas Lojas</h1>
      <Outlet /> {/* Renderiza a rota filha */}
    </div>
  );
}
```

---

## 🧪 Exercício

1. Configura React Router na app
2. Cria rotas: `/`, `/carrinho`, `/lojas`, `/loja/:id`
3. Cria um `Header` com `NavLink`
4. Na página `/loja/:id`, mostra o ID da loja
5. Adiciona uma página 404

---

## 📚 Recursos
- [React Router Docs](https://reactrouter.com/)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
