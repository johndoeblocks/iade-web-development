# Stage 1: Build TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client (if using Prisma)
RUN npx prisma generate 2>/dev/null || true

# Compile TypeScript → dist/
RUN npm run build

# Stage 2: Production image (no TypeScript, no devDeps)
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JS from builder
COPY --from=builder /app/dist ./dist

# Copy Prisma generated client if it exists
COPY --from=builder /app/generated ./generated 2>/dev/null || true

EXPOSE 3001

CMD ["node", "dist/index.js"]
