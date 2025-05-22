# Étape de build
FROM node:18 AS builder

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances
COPY package.json package-lock.json ./
RUN npm ci --production

# Copier le reste du code et construire l'application
COPY . .
RUN npm run build

# Étape de production
FROM nginx:alpine

# Copier les fichiers construits vers le dossier de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
