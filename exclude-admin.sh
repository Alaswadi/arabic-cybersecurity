#!/bin/sh

# This script temporarily moves the admin directory out of the way during build
# and then restores it afterward

echo "Backing up admin directory..."
mkdir -p /tmp/admin-backup
cp -r app/admin /tmp/admin-backup
rm -rf app/admin

echo "Admin directory backed up to /tmp/admin-backup"
