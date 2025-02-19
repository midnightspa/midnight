#!/bin/bash

BACKUP_DIR=/var/www/midnightspa/backups
DATETIME=$(date +%Y%m%d_%H%M%S)

sudo -u postgres pg_dump midnightdb > $BACKUP_DIR/backup_$DATETIME.sql

find $BACKUP_DIR -type f -mtime +7 -delete
