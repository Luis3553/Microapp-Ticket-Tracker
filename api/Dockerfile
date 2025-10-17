# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

# Copy only the compiled dist from builder
COPY --from=builder /app/dist ./dist
# Copy SQL migrations for runtime migrator
COPY --from=builder /app/drizzle ./drizzle

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
