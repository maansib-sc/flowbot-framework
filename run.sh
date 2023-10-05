#!/bin/bash

GCP_PROJECT="${GCP_PROJECT:-smarter-codes-rpa}"
GCP_ZONE="${GCP_ZONE:-us-central1-a}"

GCP_REGISTRY="${GCP_REGISTRY:-us-central1-docker.pkg.dev}"
GCP_REGISTRY_REPO="${GCP_REGISTRY_REPO:-${GCP_REGISTRY}/${GCP_PROJECT}/document-llm-frontend}" # id from your artifcat registery

BITBUCKET_REPO_SLUG="${BITBUCKET_REPO_SLUG:-sc-talkingdb-coding-llm-chatbot}" # bitbucket repo name here
BITBUCKET_BRANCH="${BITBUCKET_BRANCH:-release/v0-0-0}"
BITBUCKET_COMMIT="${BITBUCKET_COMMIT:-00000000}"
BITBUCKET_BUILD_NUMBER="${BITBUCKET_BUILD_NUMBER:-0}"


if [[ $BITBUCKET_BRANCH =~ v([0-9]+)-([0-9]+)-([0-9]+)-rc ]]; then
    REL_TAG="v${BASH_REMATCH[1]}-${BASH_REMATCH[2]}-${BASH_REMATCH[3]}-rc"
else
    REL_TAG="$BITBUCKET_BRANCH"
fi

IMAGE_TAG="${GCP_REGISTRY_REPO}/${BITBUCKET_REPO_SLUG}:${REL_TAG}-${BITBUCKET_BUILD_NUMBER}"


GCE_VM="$GCE_VM"
GCP_FOLDER_NAME="${BITBUCKET_REPO_SLUG}-${REL_TAG}"
ROOT_NAME="document-chatbot"
TLD_NAME="hybrid.chat"
HOST_NAME="${REL_TAG}.${ROOT_NAME}.${TLD_NAME}"

build() {
    if [ -n "$COMPUTE_KEY" ]; then
        echo "$COMPUTE_KEY" > compute-key.json
    fi
    
    if [ -n "$ARTIFACT_KEY" ]; then
        echo "$ARTIFACT_KEY" > artifact-key.json
    fi
    
    cat artifact-key.json | docker login -u _json_key --password-stdin https://$GCP_REGISTRY
    
    DOCKER_BUILDKIT=1 docker build --platform linux/amd64 -t "$IMAGE_TAG" .
    docker push "$IMAGE_TAG"
}

deploy() {    
    if [ -n "$COMPUTE_KEY" ]; then
        echo "$COMPUTE_KEY" > compute-key.json
    fi

    if [ -n "$ARTIFACT_KEY" ]; then
        echo "$ARTIFACT_KEY" > artifact-key.json
    fi
    
    gcloud auth activate-service-account --key-file compute-key.json
    
    
    sed \
    -e "s|\$IMAGE_TAG|${IMAGE_TAG}|" \
    -e "s|\$HOST_NAME|${HOST_NAME}|" \
    -e "s|\$REL_TAG|${REL_TAG}|" \
    -e "s|\$OPENAI_API_KEY|${OPENAI_API_KEY}|" \
    -e "s|\$PINECONE_API_KEY|${PINECONE_API_KEY}|" \
    -e "s|\$PINECONE_ENVIRONMENT|${PINECONE_ENVIRONMENT}|" \
    -e "s|\$PINECONE_INDEX_NAME|${PINECONE_INDEX_NAME}|" \
    -e "s|\$NEXT_PUBLIC_BACKEND_CONNECTOR_HOST|${NEXT_PUBLIC_BACKEND_CONNECTOR_HOST}|" \
    -e "s|\$NEXT_PUBLIC_BACKEND_CONNECTOR_KEY|${NEXT_PUBLIC_BACKEND_CONNECTOR_KEY}|" \
    -e "s|\$NEXT_PUBLIC_HI_MESSAGE_RESPONSE|${NEXT_PUBLIC_HI_MESSAGE_RESPONSE}|" \
    -e "s|\$NEXT_PUBLIC_BACKEND_CONNECTOR_WHATSAPPHOST|${NEXT_PUBLIC_BACKEND_CONNECTOR_WHATSAPPHOST}|" \
    docker-compose.main.yml > docker-compose-deploy.tmp.yml
    
    gcloud compute ssh --zone $GCP_ZONE --project $GCP_PROJECT chatbot@$GCE_VM -- mkdir -p server
    gcloud compute scp  --zone $GCP_ZONE --project $GCP_PROJECT docker-compose.traefik.yml chatbot@$GCE_VM:server
    gcloud compute ssh --zone $GCP_ZONE --project $GCP_PROJECT chatbot@$GCE_VM -- "docker network inspect doc-search-network >/dev/null 2>&1 || \
    docker network create doc-search-network" 
    gcloud compute ssh --zone $GCP_ZONE --project $GCP_PROJECT chatbot@$GCE_VM -- "cd server \
        && docker compose -f docker-compose.traefik.yml up --build -d"
    gcloud compute ssh --zone $GCP_ZONE --project $GCP_PROJECT chatbot@$GCE_VM -- mkdir -p server/$GCP_FOLDER_NAME
    gcloud compute scp  --zone $GCP_ZONE --project $GCP_PROJECT docker-compose-deploy.tmp.yml artifact-key.json chatbot@$GCE_VM:server/$GCP_FOLDER_NAME
    gcloud compute ssh --zone $GCP_ZONE --project $GCP_PROJECT chatbot@$GCE_VM -- "cd server/$GCP_FOLDER_NAME \
        && cat artifact-key.json | docker login -u _json_key --password-stdin https://$GCP_REGISTRY \
        && docker compose -f docker-compose-deploy.tmp.yml down \
        && echo y | docker image prune -a \
        && docker compose -f docker-compose-deploy.tmp.yml up --build -d"
}

case "$1" in
    build)
        build
    ;;
    deploy)
        deploy
    ;;
    stage)
        stage
    ;;
    *)
        echo "Unknown function: $1"
        echo "Available functions: build, deploy"
        exit 1
    ;;
esac