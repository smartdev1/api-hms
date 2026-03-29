FROM swaggerapi/swagger-ui:latest

# Copier le YAML au bon endroit (servi par nginx)
COPY hmis-api.yaml /usr/share/nginx/html/api.yaml

# Remplacer le fichier d'initialisation par défaut par le nôtre
COPY swagger-initializer.js /usr/share/nginx/html/swagger-initializer.js

# Optionnel : désactiver le fetch du config par défaut
ENV SWAGGER_URL=/api.yaml
ENV PORT=8080

EXPOSE 8080