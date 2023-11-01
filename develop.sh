CUR_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$CUR_DIR"

docker compose -f docker-compose.yml down --remove-orphans
docker compose -f docker-compose.yml up --build -d