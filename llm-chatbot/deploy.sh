CUR_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$CUR_DIR"

sudo docker compose -f docker-compose-server.yml down --remove-orphans
sudo docker compose -f docker-compose-server.yml up --build -d