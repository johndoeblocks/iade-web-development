# 05 - Introdução aos Hooks

## 🎯 Objetivos
- Entender o que são Hooks
- Conhecer as regras dos Hooks
- Visão geral dos Hooks principais

---

## 🪝 O Que São Hooks?

Hooks são **funções especiais** que permitem usar funcionalidades do React em componentes funcionais.

```jsx
// Antes (Class Components) - complexo
class Counter extends React.Component {
  state = { count: 0 };
  
  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };
  
  render() {
    return <button onClick={this.increment}>{this.state.count}</button>;
  }
}

// Depois (Hooks) - simples
function Counter() {
  const [count, setCount] = useState(0);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

## 📋 Hooks Principais

| Hook | Propósito |
|------|-----------|
| `useState` | Gerir estado local |
| `useEffect` | Efeitos secundários (fetch, timers, DOM) |
| `useContext` | Aceder a Context |
| `useRef` | Referência mutável / acesso DOM |
| `useMemo` | Memoização de valores |
| `useCallback` | Memoização de funções |
| `useReducer` | Estado complexo |

---

## ⚠️ Regras dos Hooks

### 1. Só no Topo do Componente

```jsx
// ❌ ERRADO - dentro de condição
function Componente({ condicao }) {
  if (condicao) {
    const [valor, setValor] = useState(0); // ERRO!
  }
}

// ❌ ERRADO - dentro de loop
function Componente({ items }) {
  items.forEach(item => {
    const [valor, setValor] = useState(item); // ERRO!
  });
}

// ✅ CORRETO - sempre no topo
function Componente({ condicao }) {
  const [valor, setValor] = useState(0);
  
  if (condicao) {
    // usar o estado aqui está OK
  }
}
```

### 2. Só em Componentes React ou Custom Hooks

```jsx
// ❌ ERRADO - função normal
function calcularPreco(pizza) {
  const [desconto] = useState(0.1); // ERRO!
  return pizza.preco * (1 - desconto);
}

// ✅ CORRETO - componente
function PrecoPizza({ pizza }) {
  const [desconto] = useState(0.1);
  return <p>€{(pizza.preco * (1 - desconto)).toFixed(2)}</p>;
}

// ✅ CORRETO - custom hook (começa com 'use')
function useDesconto(percentagem) {
  const [desconto, setDesconto] = useState(percentagem);
  return [desconto, setDesconto];
}
```

### 3. Ordem Consistente

React depende da **ordem** em que os hooks são chamados.

```jsx
function Perfil({ userId }) {
  // 1º hook - sempre primeiro
  const [user, setUser] = useState(null);
  // 2º hook - sempre segundo
  const [loading, setLoading] = useState(true);
  // 3º hook - sempre terceiro
  useEffect(() => {
    // fetch user
  }, [userId]);
  
  // A ordem NUNCA muda entre renderizações
}
```

---

## 🔍 Porquê Estas Regras?

React guarda o estado dos hooks numa **lista ordenada**:

```
Renderização 1:        Renderização 2:
[0] useState → 'João'  [0] useState → 'João'
[1] useState → true    [1] useState → false
[2] useEffect          [2] useEffect
```

Se a ordem mudar, React associa o estado errado!

---

## 🛠️ ESLint Plugin

Instala o plugin para apanhar erros automaticamente:

```bash
npm install -D eslint-plugin-react-hooks
```

```javascript
// eslint.config.js
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
];
```

---

## 🧪 Exercício

Identifica os erros neste código:

```jsx
function ListaPizzas({ mostrarPreco }) {
  const pizzas = ['Margherita', 'Pepperoni'];
  
  if (mostrarPreco) {
    const [precos, setPrecos] = useState([8.50, 10.00]);
  }
  
  pizzas.forEach(pizza => {
    const [favorito, setFavorito] = useState(false);
  });
  
  return <div>...</div>;
}
```

---

## 📚 Recursos
- [React - Introducing Hooks](https://react.dev/reference/react)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
