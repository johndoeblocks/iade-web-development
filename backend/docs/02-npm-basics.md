# 02 - npm e package.json

## 🎯 Objetivos
- Entender o npm
- Criar e gerir package.json
- Instalar e usar dependências
- Criar scripts úteis

---

## 📦 O Que é npm?

**npm** (Node Package Manager) é:
- Gestor de pacotes para JavaScript
- Maior repositório de código open-source
- Ferramenta CLI para gerir projetos

```bash
npm --version
```

---

## 🚀 Iniciar Projeto

```bash
# Criar package.json interativo
npm init

# Criar com defaults
npm init -y
```

---

## 📄 package.json Explicado

```json
{
  "name": "padre-ginos-api",
  "version": "1.0.0",
  "description": "API da pizzaria",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "echo \"No tests yet\""
  },
  "keywords": ["express", "api"],
  "author": "IADE",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### Campos importantes:
| Campo | Descrição |
|-------|-----------|
| `name` | Nome do projeto (lowercase, sem espaços) |
| `version` | Versão semântica (MAJOR.MINOR.PATCH) |
| `type` | `"module"` para usar ES modules (import/export) |
| `main` | Ficheiro de entrada |
| `scripts` | Comandos customizados |
| `dependencies` | Pacotes necessários em produção |
| `devDependencies` | Pacotes só para desenvolvimento |

---

## 📥 Instalar Pacotes

```bash
# Instalar dependência de produção
npm install express
npm i express  # shorthand

# Instalar dependência de desenvolvimento
npm install --save-dev nodemon
npm i -D nodemon  # shorthand

# Instalar versão específica
npm install express@4.18.2

# Instalar globalmente
npm install -g nodemon
```

---

## 🔢 Versionamento Semântico

```
express: "^4.18.2"
          │ │  │
          │ │  └── PATCH (bug fixes)
          │ └───── MINOR (features, backward compatible)
          └─────── MAJOR (breaking changes)

^ = aceita MINOR e PATCH updates
~ = aceita só PATCH updates
```

---

## 📜 Scripts npm

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "test": "jest"
  }
}
```

```bash
# Executar scripts
npm run dev
npm run lint

# Scripts especiais (sem 'run')
npm start
npm test
```

---

## 📁 node_modules e package-lock.json

### node_modules/
- Contém todos os pacotes instalados
- **NUNCA** fazer commit (usar .gitignore)
- Recriado com `npm install`

### package-lock.json
- Versões exatas de todas as dependências
- Garante instalações idênticas
- **DEVE** ser committed

---

## 🔄 Comandos Úteis

```bash
# Instalar dependências do projeto
npm install
npm i

# Ver pacotes desatualizados
npm outdated

# Atualizar pacotes
npm update

# Remover pacote
npm uninstall express
npm rm express

# Ver árvore de dependências
npm list
npm list --depth=0

# Limpar cache
npm cache clean --force
```

---

## 🛠️ Nodemon

Reinicia automaticamente o servidor quando há alterações:

```bash
npm i -D nodemon
```

```json
{
  "scripts": {
    "dev": "nodemon src/index.js"
  }
}
```

```bash
npm run dev
# Agora qualquer alteração reinicia o servidor!
```

---

## 🧪 Exercício

1. Cria um novo projeto com `npm init -y`
2. Instala `express` e `cors`
3. Instala `nodemon` como devDependency
4. Adiciona script `"dev": "nodemon index.js"`
5. Cria um servidor Express básico

---

## 📚 Recursos
- [npm Docs](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
