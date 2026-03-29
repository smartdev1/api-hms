FROM swaggerapi/swagger-ui:latest

# Copie le fichier YAML corrigé dans le conteneur
COPY hmis-api.yaml /usr/share/nginx/html/api.yaml

# Configure Swagger UI pour charger automatiquement ce fichier
ENV SWAGGER_JSON=/usr/share/nginx/html/api.yaml
ENV PORT=8080

EXPOSE 8080