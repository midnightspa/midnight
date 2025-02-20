#!/bin/bash

# Set the correct path to your website directory
WEBSITE_DIR="/var/www/midnightspa"
UPLOADS_DIR="$WEBSITE_DIR/public/uploads"

# Ensure the script is running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

# Fix directory permissions
find "$WEBSITE_DIR" -type d -exec chmod 755 {} \;

# Fix file permissions
find "$WEBSITE_DIR" -type f -exec chmod 644 {} \;

# Set ownership
chown -R www-data:www-data "$WEBSITE_DIR"

# Ensure uploads directory has correct permissions
chmod 755 "$UPLOADS_DIR"
find "$UPLOADS_DIR" -type f -exec chmod 644 {} \;
chown -R www-data:www-data "$UPLOADS_DIR"

echo "Permissions fixed successfully" 