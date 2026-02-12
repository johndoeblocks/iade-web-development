# 06 - useState

## 🎯 Objetivos
- Dominar o hook useState
- Entender imutabilidade
- Gerir estado derivado
- Atualizar arrays e objetos corretamente

---

## 📦 O Básico

`useState` retorna um **par**: valor atual e função para atualizar.

```jsx
import { useState } from 'react';

function Contador() {
  // [estado, funçãoParaAtualizar] = useState(valorInicial)
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Contagem: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

---

## 🔄 Atualização com Função

Quando o novo estado depende do anterior, usa uma **função**:

```jsx
// ❌ Pode dar problemas se houver múltiplas atualizações
setCount(count + 1);
setCount(count + 1); // Não soma 2!

// ✅ Correto - recebe o estado atual
setCount(prev => prev + 1);
setCount(prev => prev + 1); // Soma 2!
```

---

## 🎯 Tipos de Estado

### String
```jsx
const [nome, setNome] = useState('');

<input 
  value={nome} 
  onChange={(e) => setNome(e.target.value)} 
/>
```

### Número
```jsx
const [quantidade, setQuantidade] = useState(1);

const incrementar = () => setQuantidade(q => q + 1);
const decrementar = () => setQuantidade(q => Math.max(1, q - 1));
```

### Boolean
```jsx
const [aberto, setAberto] = useState(false);

const toggle = () => setAberto(prev => !prev);
```

---

## 📋 Arrays (Imutabilidade!)

**NUNCA** mutes o estado diretamente:

```jsx
const [carrinho, setCarrinho] = useState([]);

// ❌ ERRADO - mutação direta
carrinho.push(pizza);
setCarrinho(carrinho);

// ✅ CORRETO - criar novo array
setCarrinho([...carrinho, pizza]);

// ✅ Adicionar
setCarrinho(prev => [...prev, novaPizza]);

// ✅ Remover
setCarrinho(prev => prev.filter(p => p.id !== pizzaId));

// ✅ Atualizar item
setCarrinho(prev => prev.map(p => 
  p.id === pizzaId ? { ...p, quantidade: p.quantidade + 1 } : p
));
```

---

## 🗂️ Objetos (Imutabilidade!)

```jsx
const [pizza, setPizza] = useState({
  nome: 'Margherita',
  tamanho: 'M',
  extras: []
});

// ❌ ERRADO
pizza.tamanho = 'L';
setPizza(pizza);

// ✅ CORRETO - spread operator
setPizza({ ...pizza, tamanho: 'L' });

// ✅ Atualizar propriedade aninhada
setPizza(prev => ({
  ...prev,
  extras: [...prev.extras, 'Queijo Extra']
}));
```

---

## 🎨 Estado Derivado

Não cries estado para valores que podem ser **calculados**:

```jsx
// ❌ Evitar - estado redundante
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);

// Tens de manter sincronizado manualmente!
const addItem = (item) => {
  setItems([...items, item]);
  setTotal(total + item.preco); // Fácil esquecer!
};

// ✅ Melhor - derivar o valor
const [items, setItems] = useState([]);
const total = items.reduce((sum, item) => sum + item.preco, 0);

// total calcula-se automaticamente!
const addItem = (item) => {
  setItems([...items, item]);
};
```

---

## 🛒 Exemplo: Carrinho de Compras

```jsx
function Carrinho() {
  const [items, setItems] = useState([]);
  
  // Estado derivado
  const totalItems = items.reduce((sum, i) => sum + i.quantidade, 0);
  const totalPreco = items.reduce((sum, i) => sum + (i.preco * i.quantidade), 0);
  
  const adicionarPizza = (pizza) => {
    setItems(prev => {
      const existente = prev.find(i => i.id === pizza.id);
      if (existente) {
        return prev.map(i => 
          i.id === pizza.id 
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        );
      }
      return [...prev, { ...pizza, quantidade: 1 }];
    });
  };
  
  const removerPizza = (pizzaId) => {
    setItems(prev => prev.filter(i => i.id !== pizzaId));
  };
  
  return (
    <div>
      <p>Items: {totalItems}</p>
      <p>Total: €{totalPreco.toFixed(2)}</p>
      {items.map(item => (
        <div key={item.id}>
          {item.nome} x{item.quantidade}
          <button onClick={() => removerPizza(item.id)}>X</button>
        </div>
      ))}
    </div>
  );
}
```

---

## ⚡ Lazy Initialization

Para estados pesados de calcular, passa uma **função**:

```jsx
// ❌ Executa sempre, mesmo que não precise
const [data, setData] = useState(expensiveCalculation());

// ✅ Só executa uma vez
const [data, setData] = useState(() => expensiveCalculation());
```

---

## 🧪 Exercício

Cria um componente `CarrinhoSimples` que:
1. Mostra uma lista de pizzas disponíveis
2. Permite adicionar ao carrinho
3. Mostra itens no carrinho com quantidade
4. Permite remover itens
5. Calcula o total

---

## 📚 Recursos
- [React - useState](https://react.dev/reference/react/useState)
- [React - Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)
- [React - Updating Objects in State](https://react.dev/learn/updating-objects-in-state)
