# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --silent

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Runtime com Nginx
FROM nginx:alpine

# Remover configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuração customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build do stage anterior
COPY --from=build /app/build /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Executar nginx
CMD ["nginx", "-g", "daemon off;"]

