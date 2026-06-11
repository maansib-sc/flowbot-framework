#!/usr/bin/env bash
set -e

CUR_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$CUR_DIR"

# Copy chatbot configs into configuration/ so Next.js can resolve them at build time
cp -r ../configurations/* ./configuration/ 2>/dev/null || true

# Traefik (comment out if shared Traefik already running on the VM)
# docker compose -p lb -f docker-compose-lb.yml up --build -d

# App
docker compose -f docker-compose.yml down --remove-orphans
docker compose -f docker-compose.yml up --build -d