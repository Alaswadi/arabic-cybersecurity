#!/bin/sh

# This script restores the admin directory after build

echo "Restoring admin directory..."
mkdir -p app/admin
cp -r /tmp/admin-backup/admin/* app/admin/

echo "Admin directory restored from /tmp/admin-backup"
