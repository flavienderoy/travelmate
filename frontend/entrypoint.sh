#!/bin/sh
set -e

# Default to 80 if PORT is not set
if [ -z "$PORT" ]; then
    export PORT=80
fi

echo "Starting Nginx Setup..."
echo "Target Port: $PORT"

# Utiliser SED au lieu de envsubst pour être sûr de ne pas casser les variables Nginx ($uri)
# Remplacement de ${PORT} par la valeur réelle
sed "s/\${PORT}/$PORT/g" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "--- VALIDATION CONFIG ---"
cat /etc/nginx/conf.d/default.conf
echo "-------------------------"

# Démarrer Nginx
exec "$@"
