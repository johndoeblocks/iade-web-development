# 🗂️ Estrutura do Repositório

```
iade-web-development/
│
├── README.md                          # 📄 Este ficheiro - visão geral da estrutura do projeto
├── .gitignore                         # 🚫 Ficheiros/pastas ignorados pelo Git
├── .gitattributes                     # ⚙️ Configurações de atributos do Git
│
├── frontend/                          # ⚛️ FRONTEND - React + Vite
│   ├── README.md                      # 📄 Documentação específica do frontend
│   ├── package.json                   # 📦 Dependências e scripts do projeto
│   ├── package-lock.json              # 🔒 Versões exatas das dependências
│   ├── vite.config.js                 # ⚡ Configuração do Vite (bundler/dev server)
│   ├── eslint.config.js               # 🔍 Regras de linting (qualidade de código)
│   ├── index.html                     # 🌐 Ponto de entrada HTML (Single Page App)
│   │
│   ├── public/                        # 📁 Ficheiros estáticos (servidos diretamente)
│   │
│   ├── docs/                          # 📖 DOCUMENTAÇÃO DO FRONTEND (12 aulas)
│   │
│   └── src/                           # 💻 CÓDIGO FONTE DO FRONTEND
│       ├── main.jsx                   #    Ponto de entrada - monta a app no DOM
│       ├── App.jsx                    #    Componente raiz com rotas
│       ├── App.css                    #    Estilos globais da aplicação
│       ├── index.css                  #    Reset CSS e estilos base
│       │
│       ├── assets/                    #    Recursos estáticos (imagens, SVGs)
│       │   └── react.svg              #    Logo do React
│       │
│       ├── components/                #    🧩 Componentes reutilizáveis
│       │   ├── Header.jsx             #    Barra de navegação do topo
│       │   ├── Header.css             #    Estilos do Header
│       │   ├── Pizza.jsx              #    Card individual de pizza
│       │   └── Pizza.css              #    Estilos do card de pizza
│       │
│       ├── context/                   #    🌍 Estado global (Context API)
│       │   └── CartContext.jsx        #    Contexto do carrinho de compras
│       │
│       ├── data/                      #    📊 Dados locais (fallback/mock)
│       │   └── pizzas.js              #    Lista de pizzas para uso offline
│       │
│       ├── hooks/                     #    🪝 Custom Hooks (vazio por agora)
│       │
│       └── pages/                     #    📄 Páginas da aplicação
│           ├── Home.jsx               #    Página inicial (pizza do dia + destaques)
│           ├── Home.css               #    Estilos da Home
│           ├── Lojas.jsx              #    Página de lojas e localizações
│           ├── Lojas.css              #    Estilos da página Lojas
│           ├── Carrinho.jsx           #    Página do carrinho de compras
│           ├── Carrinho.css           #    Estilos do carrinho
│           ├── Encomenda.jsx          #    Página de finalizar encomenda
│           └── Encomenda.css          #    Estilos da encomenda
│
├── backend/                           # 🖥️ BACKEND - Node.js + Express
│   ├── package.json                   # 📦 Dependências e scripts do projeto
│   ├── package-lock.json              # 🔒 Versões exatas das dependências
│   ├── .env                           # 🔑 Variáveis de ambiente (DATABASE_URL, etc.)
│   ├── .gitignore                     # 🚫 Ficheiros ignorados (node_modules, .env)
│   │
│   ├── docs/                          # 📖 DOCUMENTAÇÃO DO BACKEND (10 aulas)
│   │   ├── 01-nodejs-intro.md         #    O que é Node.js e como funciona
│   │   ├── 02-npm-basics.md           #    NPM - gerir pacotes e dependências
│   │   ├── 03-express-intro.md        #    Express.js - criar um servidor web
│   │   ├── 04-routes-methods.md       #    Rotas e métodos HTTP (GET, POST, etc.)
│   │   ├── 05-try-catch.md            #    Tratamento de erros (try/catch)
│   │   ├── 06-async-await.md          #    Programação assíncrona (async/await)
│   │   ├── 07-filesystem-json.md      #    Ler/escrever ficheiros JSON (fs)
│   │   ├── 09-serving-html.md         #    Servir ficheiros HTML estáticos
│   │
│   └── src/                           # 💻 CÓDIGO FONTE DO BACKEND
│       ├── index.js                   #    Ponto de entrada - configura Express
│       │
│       ├── 01-intro/                  #    📚 Exercícios introdutórios
│       │   ├── hello.js               #    Primeiro script Node.js
│       │   └── info.js                #    Informações do sistema
│       │
│       ├── 02-npm/                    #    📚 Exercícios NPM
│       │   └── servidor.js            #    Servidor básico com Express
│       │
│       ├── data/                      #    💾 Base de dados JSON (filesystem)
│       │   ├── pizzas.json            #    Dados das pizzas
│       │   ├── stores.json            #    Dados das lojas
│       │   └── orders.json            #    Dados das encomendas
│       │
│       ├── routes/                    #    🛣️ Rotas da API REST
│       │   ├── pizzas.js              #    GET/POST pizzas (versão JS)
│       │   ├── pizzas_typescript.ts   #    GET/POST pizzas (versão TS)
│       │   ├── stores.js              #    GET lojas
│       │   ├── orders.js              #    GET/POST encomendas (versão JS)
│       │   └── orders_typescript.ts   #    GET/POST encomendas (versão TS)
│       │
│       └── public/                    #    🌐 Ficheiros estáticos servidos pelo Express
│           ├── admin.html             #    Painel de administração (HTML puro)
│           ├── vite.svg               #    Ícone SVG usado como favicon
│           └── exemplo.txt            #    Ficheiro exemplo de txt
│
└── deployment/                        # 🚀 DOCUMENTAÇÃO DE DEPLOYMENT
```

## 📝 Explicação da Estrutura

| Pasta                 | Descrição                                                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/`           | Aplicação **React** criada com **Vite**. Contém toda a interface que o utilizador vê no browser.                                                                      |
| `frontend/docs/`      | **aulas** progressivas que ensinam React desde o zero — JSX, componentes, hooks, formulários, Context API.                                                            |
| `frontend/src/`       | Código fonte organizado em **componentes** (peças reutilizáveis), **páginas** (ecrãs da app), **context** (estado global como o carrinho), e **data** (dados locais). |
| `backend/`            | Servidor **Node.js + Express** que fornece a API REST. 
| `backend/docs/`       | **aulas** que ensinam Node.js, Express, async/await, ficheiros JSON.
| `backend/src/routes/` | Rotas da API — cada ficheiro gere um recurso (pizzas, lojas, encomendas). Existem versões em **JavaScript** e **TypeScript** para comparação.                         |
| `backend/src/data/`   | "Base de dados" simples usando ficheiros **JSON** — abordagem mais fácil para iniciantes antes de aprender                                            |
