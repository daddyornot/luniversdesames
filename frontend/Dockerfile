# Stage 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app

# Installation de pnpm
RUN npm install -g pnpm

# Copie des fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installation des dépendances
RUN pnpm install --frozen-lockfile

# Copie du code source
COPY . .

# Build de l'application
RUN pnpm run build -- --configuration production

# Stage 2: Serve
FROM nginx:alpine

# Nettoyage du dossier par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie des fichiers buildés depuis l'étape précédente
# Assurez-vous que le chemin dist/... correspond à votre angular.json
COPY --from=build-stage /app/dist/universdesames-front/browser /usr/share/nginx/html

# Copie de la configuration Nginx
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
