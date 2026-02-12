# 02 - JSX Basics

## 🎯 Objetivos
- Entender o que é JSX
- Conhecer `React.createElement()` (o que está por trás)
- Escrever JSX fluentemente

---

## 🤔 O Que é JSX?

JSX é uma extensão de sintaxe para JavaScript que parece HTML mas é JavaScript.

```jsx
// Isto é JSX
const element = <h1>Olá, Padre Gino's!</h1>;

// É transformado em:
const element = React.createElement('h1', null, "Olá, Padre Gino's!");
```

> 💡 JSX não é obrigatório, mas torna o código muito mais legível.

---

## 🔧 React.createElement() (Por Trás dos Panos)

Antes do JSX, escrevíamos assim:

```javascript
// Sem JSX - verboso e difícil de ler
const pizza = React.createElement(
  'div',
  { className: 'pizza' },
  React.createElement('h2', null, 'Margherita'),
  React.createElement('p', null, '€8.50')
);

// Com JSX - limpo e intuitivo
const pizza = (
  <div className="pizza">
    <h2>Margherita</h2>
    <p>€8.50</p>
  </div>
);
```

---

## 📝 Regras do JSX

### 1. Um Elemento Raiz
```jsx
// ❌ Errado
return (
  <h1>Título</h1>
  <p>Parágrafo</p>
);

// ✅ Correto
return (
  <div>
    <h1>Título</h1>
    <p>Parágrafo</p>
  </div>
);

// ✅ Ou usar Fragment
return (
  <>
    <h1>Título</h1>
    <p>Parágrafo</p>
  </>
);
```

### 2. className em vez de class
```jsx
// ❌ HTML
<div class="container">

// ✅ JSX
<div className="container">
```

### 3. Fechar Todas as Tags
```jsx
// ❌ HTML permite
<img src="pizza.jpg">
<br>

// ✅ JSX exige
<img src="pizza.jpg" />
<br />
```

### 4. camelCase para Atributos
```jsx
// ❌ HTML
<button onclick="fazer()">

// ✅ JSX
<button onClick={fazer}>
```

---

## 🔀 Expressões JavaScript em JSX

Usa `{}` para inserir JavaScript:

```jsx
const nome = "Margherita";
const preco = 8.50;

return (
  <div>
    <h2>{nome}</h2>
    <p>Preço: €{preco.toFixed(2)}</p>
    <p>Com desconto: €{(preco * 0.9).toFixed(2)}</p>
    <p>{new Date().toLocaleDateString()}</p>
  </div>
);
```

---

## 🔄 Renderização Condicional

```jsx
const estaAberto = true;

return (
  <div>
    {estaAberto ? <p>Estamos abertos!</p> : <p>Fechado</p>}
    
    {/* Ou com && */}
    {estaAberto && <button>Fazer Pedido</button>}
  </div>
);
```

---

## 📋 Listas e .map()

```jsx
const pizzas = ['Margherita', 'Pepperoni', 'Hawaiana'];

return (
  <ul>
    {pizzas.map((pizza, index) => (
      <li key={index}>{pizza}</li>
    ))}
  </ul>
);
```

> ⚠️ Sempre usa `key` única em listas!

---

## 🧪 Exercício

Cria um componente que mostra:
1. O nome da pizzaria
2. Uma lista de 3 pizzas
3. Se está aberto ou fechado (baseado na hora)

---

## 📚 Recursos
- [React - Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
- [React - JavaScript in JSX](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
