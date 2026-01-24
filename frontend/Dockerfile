# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Cache des dépendances
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build -- --configuration production

# --- Stage 2: Serve ---
FROM nginx:alpine

# Suppression de la config par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie des fichiers buildés (le dossier 'browser' est standard depuis Angular 17+)
COPY --from=builder /app/dist/universdesames-front/browser /usr/share/nginx/html

# Copie de la configuration Nginx personnalisée
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
