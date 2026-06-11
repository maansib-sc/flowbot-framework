#!/usr/bin/env bash
set -e

CUR_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$CUR_DIR"

docker compose -f docker-compose-dev.yml down --remove-orphans
docker compose -f docker-compose-dev.yml up --build -d