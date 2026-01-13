# Étape 1 : Construction
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Production
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Configuration du port par défaut (si Railway ne le définit pas)
# Utilisation de envsubst pour injecter le PORT au démarrage
COPY entrypoint.sh /
# FIX: Convert CRLF to LF for BOTH script and template
RUN sed -i 's/\r$//' /entrypoint.sh && \
    sed -i 's/\r$//' /etc/nginx/conf.d/default.conf.template

RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
