#!/bin/bash

# URL of your website
WEBSITE_URL="https://midnightspa.com"  # Replace with your actual domain
REVALIDATION_SECRET="your-secret-here"  # Replace with your actual secret

# Trigger revalidation
curl -X POST "${WEBSITE_URL}/api/revalidate" \
  -H "Content-Type: application/json" \
  -d "{\"path\": \"/\", \"secret\": \"${REVALIDATION_SECRET}\"}"

echo "Revalidation triggered" 