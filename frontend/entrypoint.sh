#!/bin/sh
set -e

# Default to 80 if PORT is not set
if [ -z "$PORT" ]; then
    export PORT=80
fi

echo "Detailed setup using entrypoint..."
echo "Starting Nginx on port: $PORT"

# Replace ${PORT} in the template with the actual value
# We only substitute ${PORT} to protect other variables like $uri
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# START DEBUG: View generated config
echo "--- Generated Nginx Config ---"
cat /etc/nginx/conf.d/default.conf
echo "--- End Config ---"
# END DEBUG

exec "$@"
