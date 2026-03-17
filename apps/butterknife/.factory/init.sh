#!/bin/bash
# Idempotent environment setup for Butter AI Dashboard

# Install dependencies if node_modules doesn't exist or package.json changed
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules/.package-lock.json" ]; then
  npm install
fi
