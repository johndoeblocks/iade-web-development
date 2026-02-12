# 03 - Components e Props

## 🎯 Objetivos
- Entender o que são componentes
- Criar componentes reutilizáveis
- Passar dados com props
- Usar PropTypes para validação

---

## 🧩 O Que São Componentes?

Componentes são **blocos de construção** reutilizáveis. Pensa neles como funções que retornam UI.

```jsx
// Componente = Função que retorna JSX
function Pizza() {
  return (
    <div className="pizza">
      <h2>Margherita</h2>
      <p>€8.50</p>
    </div>
  );
}

// Usar o componente
function App() {
  return (
    <div>
      <Pizza />
      <Pizza />
      <Pizza />
    </div>
  );
}
```

> 💡 Componentes começam sempre com **letra maiúscula**.

---

## 📦 Props - Passando Dados

Props são como **argumentos de funções** para componentes.

```jsx
// Componente aceita props
function Pizza({ nome, preco, imagem }) {
  return (
    <div className="pizza">
      <img src={imagem} alt={nome} />
      <h2>{nome}</h2>
      <p>€{preco.toFixed(2)}</p>
    </div>
  );
}

// Passar props ao usar
function Menu() {
  return (
    <div>
      <Pizza 
        nome="Margherita" 
        preco={8.50} 
        imagem="/pizzas/margherita.jpg" 
      />
      <Pizza 
        nome="Pepperoni" 
        preco={10.00} 
        imagem="/pizzas/pepperoni.jpg" 
      />
    </div>
  );
}
```

---

## 🔄 Props com Arrays

```jsx
const pizzas = [
  { id: 1, nome: 'Margherita', preco: 8.50, imagem: '/margherita.jpg' },
  { id: 2, nome: 'Pepperoni', preco: 10.00, imagem: '/pepperoni.jpg' },
  { id: 3, nome: 'Hawaiana', preco: 9.50, imagem: '/hawaiana.jpg' },
];

function Menu() {
  return (
    <div className="menu">
      {pizzas.map(pizza => (
        <Pizza 
          key={pizza.id}
          nome={pizza.nome}
          preco={pizza.preco}
          imagem={pizza.imagem}
        />
      ))}
    </div>
  );
}
```

---

## 👶 Children Prop

A prop especial `children` permite passar conteúdo entre as tags.

```jsx
function Card({ children, titulo }) {
  return (
    <div className="card">
      <h3>{titulo}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// Uso
<Card titulo="Promoção">
  <p>Pizza do dia com 20% desconto!</p>
  <button>Ver mais</button>
</Card>
```

---

## ✅ PropTypes (Validação)

```jsx
import PropTypes from 'prop-types';

function Pizza({ nome, preco, imagem, disponivel }) {
  return (
    <div className={`pizza ${!disponivel ? 'indisponivel' : ''}`}>
      <img src={imagem} alt={nome} />
      <h2>{nome}</h2>
      <p>€{preco.toFixed(2)}</p>
    </div>
  );
}

Pizza.propTypes = {
  nome: PropTypes.string.isRequired,
  preco: PropTypes.number.isRequired,
  imagem: PropTypes.string.isRequired,
  disponivel: PropTypes.bool
};

Pizza.defaultProps = {
  disponivel: true
};
```

> 💡 PropTypes ajudam a apanhar erros durante o desenvolvimento.

---

## 📁 Organização de Ficheiros

```
src/
└── components/
    ├── Pizza.jsx       # Componente Pizza
    ├── Pizza.css       # Estilos do Pizza
    ├── Header.jsx
    ├── Header.css
    └── index.js        # Exporta todos
```

```jsx
// components/index.js
export { default as Pizza } from './Pizza';
export { default as Header } from './Header';

// Usar
import { Pizza, Header } from './components';
```

---

## 🧪 Exercício

1. Cria um componente `PizzaCard` que aceita: `nome`, `descricao`, `preco`, `imagem`
2. Cria um componente `Menu` que renderiza 5 pizzas usando `.map()`
3. Adiciona PropTypes
4. Adiciona estilos básicos

---

## 📚 Recursos
- [React - Your First Component](https://react.dev/learn/your-first-component)
- [React - Passing Props](https://react.dev/learn/passing-props-to-a-component)
