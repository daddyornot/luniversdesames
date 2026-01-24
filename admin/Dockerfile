# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# On build avec le base-href pour que l'admin fonctionne sous /admin/
RUN npm run build -- --configuration production --base-href /admin/

# Installation de pnpm
RUN npm install -g pnpm

# Copie des fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installation des dépendances avec pnpm
RUN pnpm install --frozen-lockfile

# Build
COPY . .
RUN pnpm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/universdesames-admin/browser /usr/share/nginx/html
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
