# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Installation de pnpm
RUN npm install -g pnpm

# Copie des fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installation des dépendances avec pnpm
RUN pnpm install --frozen-lockfile

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Suppression de la config par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie des fichiers buildés
COPY --from=builder /app/dist/universdesames-front/browser /usr/share/nginx/html

# Copie de la configuration Nginx personnalisée
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
