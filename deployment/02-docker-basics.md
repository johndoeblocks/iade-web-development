# 02 - Docker Basics

## 🎯 Objetivos
- Entender o que é Docker
- Criar Dockerfiles
- Executar containers
- Usar Docker Compose

---

## 🐳 O Que é Docker?

Docker empacota a aplicação + dependências em **containers** que funcionam igual em qualquer lugar.

```
"Funciona na minha máquina" → "Funciona em TODO o lado"
```

### Conceitos
- **Image**: Template da aplicação (como um ISO)
- **Container**: Instância em execução de uma image
- **Dockerfile**: Receita para criar a image
- **Registry**: Onde armazenar images (Docker Hub)

---

## 📦 Dockerfile - Frontend

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código
COPY . .

# Build
RUN npm run build

# Fase de produção
FROM nginx:alpine

# Copiar build para nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# frontend/nginx.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📦 Dockerfile - Backend

```dockerfile
# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências (produção)
RUN npm ci --only=production

# Copiar código
COPY . .

# Prisma: gerar client
RUN npx prisma generate

EXPOSE 3001

CMD ["node", "src/index.js"]
```

---

## 🔧 Comandos Docker

```bash
# Build image
docker build -t padre-ginos-frontend ./frontend
docker build -t padre-ginos-backend ./backend

# Listar images
docker images

# Executar container
docker run -p 8080:80 padre-ginos-frontend
docker run -p 3001:3001 padre-ginos-backend

# Listar containers
docker ps        # Em execução
docker ps -a     # Todos

# Parar container
docker stop <container_id>

# Ver logs
docker logs <container_id>

# Entrar no container
docker exec -it <container_id> sh
```

---

## 🐙 Docker Compose

Orquestra múltiplos containers:

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:3001
  
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    depends_on:
      - database
    environment:
      - DATABASE_URL=postgresql://postgres:password@database:5432/padre_ginos
      - PORT=3001
  
  database:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=padre_ginos
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

```bash
# Executar
docker-compose up

# Em background
docker-compose up -d

# Parar
docker-compose down

# Rebuild
docker-compose up --build
```

---

## 🚫 .dockerignore

```dockerignore
node_modules
npm-debug.log
.env
.env.local
dist
build
.git
.gitignore
README.md
```

---

## 🧪 Exercício

1. Cria Dockerfile para o backend
2. Cria Dockerfile para o frontend
3. Cria docker-compose.yml
4. Executa `docker-compose up`
5. Testa em http://localhost:8080

---

## 📚 Recursos
- [Docker Docs](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
