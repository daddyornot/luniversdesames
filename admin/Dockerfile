# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# On build avec le base-href pour que l'admin fonctionne sous /admin/
RUN npm run build -- --configuration production --base-href /admin/

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/universdesames-admin/browser /usr/share/nginx/html
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
