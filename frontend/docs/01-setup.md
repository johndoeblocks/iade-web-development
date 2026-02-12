# 01 - Setup de Desenvolvimento

## 🎯 Objetivos
- Instalar e configurar o ambiente de desenvolvimento
- Entender o papel de cada ferramenta
- Criar o primeiro projeto com Vite

---

## 🛠️ Ferramentas Necessárias

### 1. Node.js
JavaScript runtime que permite executar JS fora do browser.

```bash
# Verificar instalação
node --version  # v20+
npm --version   # v10+
```

> 💡 **Recomendado:** Usar [nvm](https://github.com/nvm-sh/nvm) ou [fnm](https://github.com/Schniz/fnm) para gerir versões.

### 2. VS Code
IDE moderno com excelente suporte para JavaScript/React.

**Extensões recomendadas:**
- ESLint
- Prettier
- ES7+ React/Redux/React-Native snippets

### 3. Vite
Bundler moderno e rápido para desenvolvimento frontend.

```bash
# Criar projeto
npm create vite@latest meu-projeto -- --template react

# Instalar dependências
cd meu-projeto && npm install

# Iniciar servidor
npm run dev
```

---

## 📁 Estrutura do Projeto Vite

```
frontend/
├── index.html        # Ponto de entrada HTML
├── package.json      # Dependências e scripts
├── vite.config.js    # Configuração do Vite
├── src/
│   ├── main.jsx      # Ponto de entrada React
│   ├── App.jsx       # Componente raiz
│   └── App.css       # Estilos
└── public/           # Assets estáticos
```

---

## ⚙️ ESLint + Prettier

### ESLint
Encontra problemas no código.

```bash
npm install -D eslint @eslint/js
```

### Prettier
Formata o código automaticamente.

```bash
npm install -D prettier eslint-config-prettier
```

### Configuração
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

---

## 🧪 Exercício

1. Cria um novo projeto Vite chamado `padre-ginos`
2. Abre no VS Code
3. Altera o `App.jsx` para mostrar "Bem-vindo à Padre Gino's!"
4. Corre `npm run dev` e vê o resultado

---

## 📚 Recursos
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
