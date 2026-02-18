FROM node:20-alpine

WORKDIR /app

# Copy package files first (better Docker cache)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client (if using Prisma)
RUN npx prisma generate 2>/dev/null || true

EXPOSE 3001

CMD ["node", "src/index.js"]
