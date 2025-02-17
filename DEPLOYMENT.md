# Deployment Guide for The Midnight Spa

## Server Information
- Server IP: 5.161.86.130
- Domain: themidnightspa.com
- Database: PostgreSQL
- Node.js Version: 18.x
- PM2 for process management

## Updating Content

### 1. Content Updates Through Dashboard
For blog posts, products, videos, and other content managed through the admin dashboard:
1. Log in at https://themidnightspa.com/auth/signin
2. Navigate to the appropriate section
3. Make your changes
4. Changes are immediate - no deployment needed

### 2. Code Changes (New Features/Pages)
```bash
# 1. Locally, make your changes
# 2. Test locally with:
npm run dev

# 3. Commit and push your changes
git add .
git commit -m "Your commit message"
git push

# 4. On the server:
ssh root@5.161.86.130
cd /var/www/html
./deploy.sh
```

### 3. Database Schema Changes
```bash
# 1. Locally, modify schema.prisma
# 2. Generate and apply migrations locally:
npx prisma generate
npx prisma migrate dev

# 3. Commit and push your changes
git add .
git commit -m "Updated database schema"
git push

# 4. On the server:
ssh root@5.161.86.130
cd /var/www/html
./deploy.sh
npx prisma migrate deploy
```

### 4. Static Assets (Images/Files)
```bash
# 1. Add files to the public directory
# 2. Commit and push
git add .
git commit -m "Added new assets"
git push

# 3. On the server:
ssh root@5.161.86.130
cd /var/www/html
./deploy.sh
```

### 5. Environment Variables
```bash
# On the server:
ssh root@5.161.86.130
cd /var/www/html
nano .env

# After editing, restart the application:
pm2 restart midnightspa --update-env
```

## Server Deployment Script
The server has a deployment script (`deploy.sh`) that handles common deployment tasks:
```bash
#!/bin/bash

echo "Pulling latest changes..."
git pull

echo "Installing dependencies..."
npm install

echo "Building application..."
npm run build

echo "Restarting application..."
pm2 restart midnightspa --update-env

echo "Deployment complete!"
```

## Common Commands

### PM2 Commands
```bash
# View application status
pm2 status

# View logs
pm2 logs midnightspa

# Restart application
pm2 restart midnightspa

# Stop application
pm2 stop midnightspa

# Start application
pm2 start midnightspa
```

### Database Commands
```bash
# Access PostgreSQL
sudo -u postgres psql

# Backup database
pg_dump -U midnightadmin midnightspa > backup.sql

# Restore database
psql -U midnightadmin midnightspa < backup.sql
```

### Nginx Commands
```bash
# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Database Connection Issues
1. Check database credentials in .env file
2. Verify PostgreSQL is running:
```bash
sudo systemctl status postgresql
```
3. Test database connection:
```bash
psql -U midnightadmin -d midnightspa -h localhost
```

### Application Not Starting
1. Check PM2 logs:
```bash
pm2 logs midnightspa
```
2. Verify environment variables:
```bash
pm2 env midnightspa
```
3. Check Node.js version:
```bash
node --version
```

### SSL/HTTPS Issues
1. Check SSL certificate status:
```bash
sudo certbot certificates
```
2. Renew certificates:
```bash
sudo certbot renew
```

## Backup Procedures

### Database Backup
```bash
# Create backup
sudo -u postgres pg_dump midnightspa > backup_$(date +%Y%m%d).sql

# Restore from backup
sudo -u postgres psql midnightspa < backup_file.sql
```

### File Backup
```bash
# Backup uploads directory
tar -czf uploads_$(date +%Y%m%d).tar.gz /var/www/html/public/uploads

# Backup entire application
tar -czf midnightspa_$(date +%Y%m%d).tar.gz /var/www/html
```

## Security Considerations
1. Keep Node.js and npm packages updated
2. Regularly update system packages:
```bash
sudo apt update
sudo apt upgrade
```
3. Monitor logs for suspicious activity
4. Keep backups current
5. Regularly rotate SSH keys and passwords
6. Keep SSL certificates up to date 