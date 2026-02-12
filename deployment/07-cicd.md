# 07 - CI/CD Básico

## 🎯 Objetivos
- Entender CI/CD
- Configurar auto-deploy
- Executar migrations automaticamente
- Git workflow para produção

---

## 🔄 O Que é CI/CD?

### CI - Continuous Integration
Cada push testa e valida o código automaticamente.

### CD - Continuous Deployment
Após validação, deploy automático para produção.

```
git push → Testes → Build → Deploy → Produção
```

---

## 🚂 Railway Auto-Deploy

Railway faz deploy automático quando:
1. Push para branch main (ou configurada)
2. Build commands executam
3. Aplicação inicia

### Configurar Branch
No Railway:
1. Service → Settings
2. "Source Branch" → main

---

## 🏗️ Build Commands

### package.json (Backend)
```json
{
  "scripts": {
    "build": "npx prisma generate && npx prisma migrate deploy",
    "start": "node src/index.js"
  }
}
```

### package.json (Frontend)
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 🔀 Git Workflow

### Branches
```
main        → Produção (auto-deploy)
develop     → Desenvolvimento
feature/*   → Features novas
```

### Workflow Simples
```bash
# 1. Criar branch para feature
git checkout -b feature/nova-pizza

# 2. Desenvolver e commitar
git add .
git commit -m "feat: adiciona pizza do mês"

# 3. Push e create PR
git push origin feature/nova-pizza
# Criar Pull Request no GitHub

# 4. Após review, merge para main
git checkout main
git merge feature/nova-pizza
git push origin main
# → Deploy automático!
```

---

## ✅ Checklist Pré-Deploy

```yaml
# Antes de merge para main:
- [ ] Funciona localmente
- [ ] Sem erros de lint
- [ ] Variáveis de ambiente configuradas no Railway
- [ ] Migrations testadas
- [ ] Build local funciona
```

---

## 🛠️ GitHub Actions (Opcional)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Build
      run: npm run build
```

---

## 📋 Migrations Automáticas

No Railway, as migrations executam no build:

```json
{
  "scripts": {
    "build": "npx prisma migrate deploy"
  }
}
```

### Cuidados:
1. Testar migration localmente primeiro
2. Nunca alterar migrations já aplicadas
3. Fazer backup antes de migrations destrutivas

---

## 🔙 Rollback

Se algo correr mal:

### Railway
1. Vai ao Service → Deployments
2. Encontra deployment anterior que funcionava
3. "Rollback" para esse deployment

### Git
```bash
# Reverter commit
git revert HEAD
git push

# Ou voltar a commit específico
git revert <commit-hash>
```

---

## 🧪 Exercício

1. Configura auto-deploy no Railway
2. Faz uma alteração pequenapush para main
3. Verifica deploy automático
4. Testa a aplicação em produção

---

## 📚 Recursos
- [Railway Deployments](https://docs.railway.app/deploy/deployments)
- [GitHub Actions](https://docs.github.com/en/actions)
