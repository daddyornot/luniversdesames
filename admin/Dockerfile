# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
# Build standard (racine) car on utilisera un sous-domaine admin.domaine.com
RUN npm run build -- --configuration production

# --- Stage 2: Serve ---
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/universdesames-admin/browser /usr/share/nginx/html
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
