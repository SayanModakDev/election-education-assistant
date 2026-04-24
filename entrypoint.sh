#!/bin/sh

# This script generates a window.ENV object at runtime using the 
# environment variables provided by Google Cloud Run.
# This allows you to manage the API key in the Cloud Console 
# without rebuilding the container.

echo "window.ENV = {" > /usr/share/nginx/html/env-config.js
echo "  VITE_API_KEY: \"$VITE_API_KEY\"" >> /usr/share/nginx/html/env-config.js
echo "};" >> /usr/share/nginx/html/env-config.js

# Start Nginx (exec replaces the shell process with nginx)
exec nginx -g "daemon off;"
