FROM nginx:alpine

# Supprimer la config par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le prototype
COPY public/index.html /usr/share/nginx/html/index.html

# Copier la documentation Swagger
COPY docs/api.yaml /usr/share/nginx/html/docs/api.yaml
COPY docs/index.html /usr/share/nginx/html/docs/index.html

# Copier le swagger-initializer
COPY public/swagger-initializer.js /usr/share/nginx/html/swagger-initializer.js

# Exposer le port
EXPOSE 8080

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]