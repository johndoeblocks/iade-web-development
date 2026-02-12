# 10 - Formulários em React

## 🎯 Objetivos
- Criar formulários controlados
- Validar inputs
- Submeter formulários
- Boas práticas de UX

---

## 🎮 Controlled vs Uncontrolled

### Controlled (Recomendado)
React controla o valor do input:

```jsx
function Form() {
  const [nome, setNome] = useState('');
  
  return (
    <input
      type="text"
      value={nome}
      onChange={(e) => setNome(e.target.value)}
    />
  );
}
```

### Uncontrolled
DOM controla o valor:

```jsx
function Form() {
  const inputRef = useRef();
  
  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };
  
  return <input type="text" ref={inputRef} />;
}
```

> 💡 Controlados dão mais controlo para validação em tempo real.

---

## 📝 Formulário Completo

```jsx
function FormularioEncomenda() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    morada: '',
    observacoes: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        placeholder="Nome"
      />
      
      <input
        type="tel"
        name="telefone"
        value={formData.telefone}
        onChange={handleChange}
        placeholder="Telefone"
      />
      
      <textarea
        name="morada"
        value={formData.morada}
        onChange={handleChange}
        placeholder="Morada de entrega"
      />
      
      <textarea
        name="observacoes"
        value={formData.observacoes}
        onChange={handleChange}
        placeholder="Observações (opcional)"
      />
      
      <button type="submit">Fazer Encomenda</button>
    </form>
  );
}
```

---

## ✅ Validação

### Validação Simples
```jsx
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  
  if (!formData.nome.trim()) {
    newErrors.nome = 'Nome é obrigatório';
  }
  
  if (!formData.telefone.match(/^\d{9}$/)) {
    newErrors.telefone = 'Telefone deve ter 9 dígitos';
  }
  
  if (!formData.morada.trim()) {
    newErrors.morada = 'Morada é obrigatória';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (validate()) {
    // Submeter formulário
  }
};
```

### Mostrar Erros
```jsx
<div className="form-group">
  <input
    type="text"
    name="nome"
    value={formData.nome}
    onChange={handleChange}
    className={errors.nome ? 'error' : ''}
  />
  {errors.nome && (
    <span className="error-message">{errors.nome}</span>
  )}
</div>
```

---

## 🍕 Formulário de Pizza

```jsx
function PizzaForm({ pizza, onAddToCart }) {
  const [tamanho, setTamanho] = useState('M');
  const [quantidade, setQuantidade] = useState(1);
  const [extras, setExtras] = useState([]);
  
  const precos = { P: 0.8, M: 1, G: 1.3 };
  const extrasDisponiveis = ['Queijo Extra', 'Bacon', 'Cogumelos'];
  
  const precoFinal = pizza.preco * precos[tamanho] * quantidade;
  
  const handleExtraChange = (extra) => {
    setExtras(prev => 
      prev.includes(extra)
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddToCart({
      ...pizza,
      tamanho,
      quantidade,
      extras,
      precoTotal: precoFinal
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Tamanho */}
      <div className="tamanhos">
        {['P', 'M', 'G'].map(t => (
          <label key={t}>
            <input
              type="radio"
              name="tamanho"
              value={t}
              checked={tamanho === t}
              onChange={(e) => setTamanho(e.target.value)}
            />
            {t}
          </label>
        ))}
      </div>
      
      {/* Quantidade */}
      <div className="quantidade">
        <button type="button" onClick={() => setQuantidade(q => Math.max(1, q - 1))}>
          -
        </button>
        <span>{quantidade}</span>
        <button type="button" onClick={() => setQuantidade(q => q + 1)}>
          +
        </button>
      </div>
      
      {/* Extras */}
      <div className="extras">
        {extrasDisponiveis.map(extra => (
          <label key={extra}>
            <input
              type="checkbox"
              checked={extras.includes(extra)}
              onChange={() => handleExtraChange(extra)}
            />
            {extra} (+€1.00)
          </label>
        ))}
      </div>
      
      <button type="submit">
        Adicionar €{precoFinal.toFixed(2)}
      </button>
    </form>
  );
}
```

---

## 📱 Select e Radio

### Select
```jsx
const [cidade, setCidade] = useState('');

<select value={cidade} onChange={(e) => setCidade(e.target.value)}>
  <option value="">Seleciona a cidade</option>
  <option value="lisboa">Lisboa</option>
  <option value="porto">Porto</option>
  <option value="faro">Faro</option>
</select>
```

### Radio Buttons
```jsx
const [pagamento, setPagamento] = useState('cartao');

<div>
  <label>
    <input
      type="radio"
      name="pagamento"
      value="cartao"
      checked={pagamento === 'cartao'}
      onChange={(e) => setPagamento(e.target.value)}
    />
    Cartão
  </label>
  <label>
    <input
      type="radio"
      name="pagamento"
      value="dinheiro"
      checked={pagamento === 'dinheiro'}
      onChange={(e) => setPagamento(e.target.value)}
    />
    Dinheiro
  </label>
</div>
```

---

## 🎨 Estilos

```css
.form-group {
  margin-bottom: 1rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus {
  border-color: #e63946;
  outline: none;
}

.form-group input.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
```

---

## 🧪 Exercício

1. Cria formulário de encomenda com nome, telefone, morada
2. Adiciona validação (fields obrigatórios)
3. Cria seletor de tamanho de pizza (radio)
4. Adiciona checkboxes para extras
5. Mostra preview do pedido antes de submeter

---

## 📚 Recursos
- [React - Forms](https://react.dev/reference/react-dom/components/input)
- [React - Controlled Components](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components)
