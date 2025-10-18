# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --no-audit --no-fund

# Build
COPY . .
RUN npm run build

# Runtime stage (nginx)
FROM nginx:1.25-alpine

# Nginx config for SPA routing
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

