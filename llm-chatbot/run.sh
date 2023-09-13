#!/bin/bash

GCP_PROJECT="${GCP_PROJECT:-smarter-codes-rpa}"
GCP_ZONE="${GCP_ZONE:-us-central1-a}"

GCP_REGISTRY="${GCP_REGISTRY:-us-central1-docker.pkg.dev}"
GCP_REGISTRY_REPO="${GCP_REGISTRY_REPO:-${GCP_REGISTRY}/smarter-codes-rpa/document-llm-frontend}"

BITBUCKET_REPO_SLUG="${BITBUCKET_REPO_SLUG:-sc-talkingdb-coding-llm-chatbot}"
BITBUCKET_BRANCH="${BITBUCKET_BRANCH:-release/v0-0-0-rc}"
BITBUCKET_COMMIT="${BITBUCKET_COMMIT:-00000000}"
BITBUCKET_BUILD_NUMBER="${BITBUCKET_BUILD_NUMBER:-0}"

if [[ $BITBUCKET_BRANCH =~ v([0-9]+)-([0-9]+)-([0-9]+)-rc ]]; then
    REL_TAG="v${BASH_REMATCH[1]}-${BASH_REMATCH[2]}-${BASH_REMATCH[3]}-rc"
else
    REL_TAG="v0-0-0-rc"
fi

IMAGE_TAG="${GCP_REGISTRY_REPO}/${BITBUCKET_REPO_SLUG}:${BITBUCKET_COMMIT}-${BITBUCKET_BUILD_NUMBER}"


GCE_VM="${GCE_VM}"
HOST="${HOST}"
# GCE_VM="staging-chatbot-llm"
# HOST="chat-staging.smarter.codes"

build() {
    if [ -n "$ARTIFACT_KEY" ]; then
        echo "$ARTIFACT_KEY" > artifact-key.json
    fi
    
    cat artifact-key.json | docker login -u _json_key --password-stdin https://$GCP_REGISTRY
    
    DOCKER_BUILDKIT=1 docker build --platform linux/amd64 -t "$IMAGE_TAG" .
    docker push "$IMAGE_TAG"
}

stage() {
    if [ -n "$ARTIFACT_KEY" ]; then
        echo "$ARTIFACT_KEY" > artifact-key.json
    fi
    if [ -n "$COMPUTE_KEY" ]; then
        echo "$COMPUTE_KEY" > compute-key.json
    fi
    
    gcloud auth activate-service-account --key-file compute-key.json
    
    
    sed \
    -e "s|\$IMAGE_TAG|${IMAGE_TAG}|" \
    -e "s|\$HOST|${HOST}|" \
    -e "s|\$OPENAI_API_KEY|${OPENAI_API_KEY}|" \
    -e "s|\$PINECONE_API_KEY|${PINECONE_API_KEY}|" \
    -e "s|\$PINECONE_ENVIRONMENT|${PINECONE_ENVIRONMENT}|" \
    -e "s|\$PINECONE_INDEX_NAME|${PINECONE_INDEX_NAME}|" \
    -e "s|\$NEXT_PUBLIC_BACKEND_CONNECTOR_HOST|${NEXT_PUBLIC_BACKEND_CONNECTOR_HOST}|" \
    -e "s|\$NEXT_PUBLIC_BACKEND_CONNECTOR_KEY|${NEXT_PUBLIC_BACKEND_CONNECTOR_KEY}|" \
    docker-compose-server.yml > docker-compose-deploy.tmp.yml
    
    gcloud compute ssh --zone $GCP_ZONE --project $GCP_PROJECT ubuntu@$GCE_VM -- mkdir -p server/llm-chatbot/$BITBUCKET_REPO_SLUG
    gcloud compute ssh --zone $GCP_ZONE --project $GCP_PROJECT ubuntu@$GCE_VM -- mkdir -p server/llm-chatbot/$BITBUCKET_REPO_SLUG/acme
    gcloud compute scp  --zone $GCP_ZONE --project $GCP_PROJECT acme/acme.sh ubuntu@$GCE_VM:server/llm-chatbot/$BITBUCKET_REPO_SLUG/acme/
    gcloud compute scp  --zone $GCP_ZONE --project $GCP_PROJECT .env docker-compose-deploy.tmp.yml artifact-key.json ubuntu@$GCE_VM:server/llm-chatbot/$BITBUCKET_REPO_SLUG
    gcloud compute ssh --zone $GCP_ZONE --project $GCP_PROJECT ubuntu@$GCE_VM -- "cd server/llm-chatbot/$BITBUCKET_REPO_SLUG \
        && cat artifact-key.json | docker login -u _json_key --password-stdin https://$GCP_REGISTRY \
        && docker compose -f docker-compose-deploy.tmp.yml down\
        && echo y | docker image prune -a \
        && docker compose -f docker-compose-deploy.tmp.yml up -d"
}

deploy() {    
    if [ -n "$ARTIFACT_KEY" ]; then
        echo "$ARTIFACT_KEY" > artifact-key.json
    fi
    if [ -n "$COMPUTE_KEY" ]; then
        echo "$COMPUTE_KEY" > compute-key.json
    fi
    
    gcloud auth activate-service-account --key-file compute-key.json
    
    
    sed \
    -e "s|\$IMAGE_TAG|${IMAGE_TAG}|" \
    -e "s|\$HOST|${HOST}|" \
    -e "s|\$OPENAI_API_KEY|${OPENAI_API_KEY}|" \
    -e "s|\$PINECONE_API_KEY|${PINECONE_API_KEY}|" \
    -e "s|\$PINECONE_ENVIRONMENT|${PINECONE_ENVIRONMENT}|" \
    -e "s|\$PINECONE_INDEX_NAME|${PINECONE_INDEX_NAME}|" \
    -e "s|\$NEXT_PUBLIC_BACKEND_CONNECTOR_HOST|${NEXT_PUBLIC_BACKEND_CONNECTOR_HOST}|" \
    -e "s|\$NEXT_PUBLIC_BACKEND_CONNECTOR_KEY|${NEXT_PUBLIC_BACKEND_CONNECTOR_KEY}|" \
    docker-compose-server.yml > docker-compose-deploy.tmp.yml
    
    gcloud compute ssh --zone $GCP_ZONE --project $GCP_PROJECT ubuntu@$GCE_VM -- mkdir -p server/llm-chatbot/$BITBUCKET_REPO_SLUG
    gcloud compute ssh --zone $GCP_ZONE --project $GCP_PROJECT ubuntu@$GCE_VM -- mkdir -p server/llm-chatbot/$BITBUCKET_REPO_SLUG/acme
    gcloud compute scp  --zone $GCP_ZONE --project $GCP_PROJECT acme/acme.sh ubuntu@$GCE_VM:server/llm-chatbot/$BITBUCKET_REPO_SLUG/acme/
    gcloud compute scp  --zone $GCP_ZONE --project $GCP_PROJECT .env docker-compose-deploy.tmp.yml artifact-key.json ubuntu@$GCE_VM:server/llm-chatbot/$BITBUCKET_REPO_SLUG
    gcloud compute ssh --zone $GCP_ZONE --project $GCP_PROJECT ubuntu@$GCE_VM -- "cd server/llm-chatbot/$BITBUCKET_REPO_SLUG \
        && cat artifact-key.json | docker login -u _json_key --password-stdin https://$GCP_REGISTRY \
        && docker compose -f docker-compose-deploy.tmp.yml down\
        && echo y | docker image prune -a \
        && docker compose -f docker-compose-deploy.tmp.yml up -d"
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