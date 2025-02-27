#!/bin/bash

# Create a directory to store the downloaded images
mkdir -p public/uploads

# List of image files to download - these are the exact filenames from the server
IMAGES=(
  "1740564137384-angq3-Untitled design (22).jpg"
  "1740564273450-shvji5-Untitled design (23).jpg"
  "1740481056258-1572ak-Untitled design (5).jpg"
  "1740507166336-fk84yu-IMG_3742.JPG"
  "1740420449223-5dbt0o-upload-1739533114478-311608704.jpg"
  "1740486254715-q883ki-stress-management.jpg"
  "1740563580739-mly70q-Untitled design (21).jpg"
  "1740592792764-o1yx5-Untitled design (24).jpg"
)

# Download each image with proper escaping for spaces and parentheses
for IMAGE in "${IMAGES[@]}"; do
  echo "Downloading $IMAGE..."
  
  # Create a temporary file with the command to execute on the server
  cat > /tmp/scp_command.sh << EOF
#!/bin/bash
cd /var/www/midnightspa/public/uploads
ls -la "$IMAGE" 2>/dev/null && echo "File exists" || echo "File does not exist"
EOF

  # Make the script executable
  chmod +x /tmp/scp_command.sh
  
  # Check if the file exists on the server
  FILE_EXISTS=$(ssh root@5.78.70.244 "bash -s" < /tmp/scp_command.sh | grep "File exists")
  
  if [ -n "$FILE_EXISTS" ]; then
    # File exists, download it
    scp "root@5.78.70.244:/var/www/midnightspa/public/uploads/${IMAGE}" "public/uploads/" || {
      echo "Failed to download $IMAGE"
    }
  else
    echo "File $IMAGE does not exist on the server"
  fi
done

echo "Download complete!" 