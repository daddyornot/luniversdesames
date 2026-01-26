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
RUN pnpm run build

# Stage 2: Serve
FROM nginx:alpine

# Nettoyage du dossier par défaut
RUN rm -rf /usr/share/nginx/html/*

# Création du dossier admin
RUN mkdir -p /usr/share/nginx/html/admin

# Copie des fichiers buildés dans le sous-dossier admin
COPY --from=build-stage /app/dist/admin/browser /usr/share/nginx/html/admin

# Renommage de index.csr.html en index.html si nécessaire (dans le sous-dossier)
RUN if [ -f /usr/share/nginx/html/admin/index.csr.html ]; then mv /usr/share/nginx/html/admin/index.csr.html /usr/share/nginx/html/admin/index.html; fi

# Correction des permissions
RUN chmod -R 755 /usr/share/nginx/html

# Copie de la configuration Nginx
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
