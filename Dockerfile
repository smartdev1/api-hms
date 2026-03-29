FROM nginx:alpine

# Supprimer la config par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier TOUS les fichiers public vers nginx
COPY public/ /usr/share/nginx/html/

# Exposer le port
EXPOSE 8080

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]