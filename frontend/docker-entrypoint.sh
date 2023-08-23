#!/bin/sh
set -eu

API_URL="${API_URL:-}"

# Check if API_URL is empty
if [ -z "$API_URL" ]; then
    echo "API_URL is required"
    exit 1
fi

# Update config.json with the API URL
echo "
{
    \"apiUrl\": \"$API_URL\"
}
" > /usr/share/nginx/html/assets/config.json

# Start Nginx
nginx -g 'daemon off;'
