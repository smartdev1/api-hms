FROM swaggerapi/swagger-ui:latest

# Copier le fichier YAML vers un chemin temporaire d'abord
COPY hmis-api.yaml /tmp/api.yaml

# Utiliser l'entrypoint de swagger-ui qui gère correctement le fichier
ENV SWAGGER_JSON=/tmp/api.yaml
ENV PORT=8080

# Le port est déjà exposé par l'image de base, mais on le déclare pour clarté
EXPOSE 8080