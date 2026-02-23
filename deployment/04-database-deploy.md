# 04 - Deploy de Base de Dados

## 🎯 Objetivos
- Configurar PostgreSQL em produção
- Usar Railway para hospedar DB
- Executar migrations

---

## ☁️ Railway - Setup PostgreSQL

### 1. Criar Projeto
1. Vai a [railway.app](https://railway.app)
2. "New Project"
3. "Deploy from GitHub repo" ou "Empty Project"

### 2. Adicionar PostgreSQL
1. "New" → "Database" → "PostgreSQL"
2. Espera provisionar
3. Clica no serviço PostgreSQL
4. "Variables" → copia `DATABASE_URL`

```
postgresql://postgres:AbCdEf123@host.railway.internal:5432/railway
```

---

## 🔧 Configurar Prisma

### schema.prisma
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### .env.production
```bash
DATABASE_URL="postgresql://postgres:AbCdEf123@host.railway.internal:5432/railway"
```

---

## 📤 Migrations em Produção

### Localmente (apontar para prod DB)
```bash
# Exportar DATABASE_URL de produção
export DATABASE_URL="postgresql://..."

# Executar migration
npx prisma migrate deploy
```

### No CI/CD
```yaml
# No Railway, adiciona como script de build
npx prisma migrate deploy
```

---

## 🌱 Seed Data

```javascript
// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpar dados existentes


  prisma.user.findMany(
    {
      where: {
        name: {equals: "João"}
      }
    }
  )

  


  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.pizza.deleteMany();
  await prisma.store.deleteMany();
  
  // Inserir pizzas
  await prisma.pizza.createMany({
    data: [
      { nome: 'Margherita', descricao: 'Clássica italiana', preco: 8.50 },
      { nome: 'Pepperoni', descricao: 'Com pepperoni picante', preco: 10.00 },
      // ...
    ]
  });
  
  // Inserir lojas
  await prisma.store.createMany({
    data: [
      { nome: 'Lisboa - Chiado', morada: 'Rua Garrett 25', telefone: '+351 21 123 4567' },
      // ...
    ]
  });
  
  console.log('Seed completo!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```json
// package.json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

```bash
npx prisma db seed
```

---

## 🔒 Segurança

### Conexões Seguras
```bash
# Railway providencia SSL automaticamente
DATABASE_URL="postgresql://...?sslmode=require"
```

### Backups
Railway faz backups automáticos. Para backups manuais:

```bash
# Exportar
pg_dump $DATABASE_URL > backup.sql

# Importar
psql $DATABASE_URL < backup.sql
```

---

## 🔍 Aceder via Prisma Studio

```bash
# Localmente apontando para prod
DATABASE_URL="..." npx prisma studio
```

---

## 🧪 Exercício

1. Cria projeto no Railway
2. Adiciona PostgreSQL
3. Configura DATABASE_URL no backend
4. Executa migrations
5. Seed com dados iniciais

---

## 📚 Recursos
- [Railway Docs](https://docs.railway.app/)
- [Prisma Deploy](https://www.prisma.io/docs/guides/deployment)
