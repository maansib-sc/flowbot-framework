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

IMAGE_TAG="${GCP_REGISTRY_REPO}/${BITBUCKET_REPO_SLUG}:${BITBUCKET_COMMIT}-${BITBUCKET_BUILD_NUMBER}"
IMAGE_TAG_CACHE="${GCP_REGISTRY_REPO}/${BITBUCKET_REPO_SLUG}:cache"

GCP_CLUSTER_PROD=kg-hybrid-chat
GCP_CLUSTER_DEV=kg-hybrid-chat
GCP_CLUSTER_REL=kg-hybrid-chat

HOST_PROD="kg.hybrid.chat"
HOST_DEV="kg.hybrid.chat"
HOST_REL="kg.hybrid.chat"

APP_PROD="$HOST_PROD"
APP_DEV="dev.$HOST_DEV"
APP_REL="$REL_TAG.$HOST_REL"

CONNECTOR_PROD="https://llm-connect.$HOST_PROD"
CONNECTOR_DEV="https://llm-connect-dev.$HOST_DEV"
CONNECTOR_REL="https://llm-connect-$REL_TAG.$HOST_REL"

SIMILARITY_PROD="https://text-similarity.$HOST_PROD"
SIMILARITY_DEV="https://text-similarity-dev.$HOST_DEV"
SIMILARITY_REL="https://text-similarity-$REL_TAG.$HOST_REL"

build() {
    if [ -n "$COMPUTE_KEY" ]; then
        echo "$COMPUTE_KEY" > compute-key.json
    fi
    
    if [ -n "$ARTIFACT_KEY" ]; then
        echo "$ARTIFACT_KEY" > artifact-key.json
    fi
    
    cat artifact-key.json | docker login -u _json_key --password-stdin https://$GCP_REGISTRY
    
    DOCKER_BUILDKIT=1 docker build \
    --platform linux/amd64 \
    --cache-from "$IMAGE_TAG_CACHE" \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    -t "$IMAGE_TAG" -t "$IMAGE_TAG_CACHE" .
    
    docker push "$IMAGE_TAG_CACHE"
    docker push "$IMAGE_TAG"
}

deploy() {
    local URL="$1"
    local NAMESPACE="$2"
    local GCP_CLUSTER="$3"
    local CONNECTOR="$4"
    local SIMILARITY="$5"
    local ENV_FILE="$6"
    
    if [ -n "$K8S_KEY" ]; then
        echo "$K8S_KEY" > k8s-key.json
    fi
    
    gcloud auth activate-service-account --key-file k8s-key.json
    gcloud container clusters get-credentials $GCP_CLUSTER --zone $GCP_ZONE --project $GCP_PROJECT
    
    kubectl create namespace "$NAMESPACE" -o yaml --dry-run=client | kubectl apply -f -
    
    if [ -n "$ENV_FILE" ]; then
        echo -e "$ENV_FILE" > .env
    fi
    
    if [ -f .env ]; then
        kubectl delete secret "$BITBUCKET_REPO_SLUG-env" --namespace="$NAMESPACE" || :
        kubectl create secret generic "$BITBUCKET_REPO_SLUG-env" --namespace="$NAMESPACE" --from-env-file=.env
    fi
    
    sed \
    -e "s|\$IMAGE_TAG|${IMAGE_TAG}|" \
    -e "s|\$APP|${BITBUCKET_REPO_SLUG}|" \
    -e "s|\$URL|${URL}|" \
    -e "s|\$PORT|80|" \
    -e "s|\$CONNECTOR|${CONNECTOR}|" \
    -e "s|\$SIMILARITY|${SIMILARITY}|" \
    kube-deployment.yml > kube-deployment.tmp.yml
    
    kubectl apply --namespace="$NAMESPACE" -f kube-deployment.tmp.yml
}

deploy-dev() {
    deploy \
    "$APP_DEV" \
    "$BITBUCKET_BRANCH" \
    "$GCP_CLUSTER_DEV" \
    "$CONNECTOR_DEV" \
    "$SIMILARITY_DEV" \
    "$ENV_DEV"
}

deploy-prod() {
    deploy \
    "$APP_PROD" \
    "prod" \
    "$GCP_CLUSTER_PROD" \
    "$CONNECTOR_PROD" \
    "$SIMILARITY_PROD" \
    "$ENV_PROD"
}

deploy-rel() {
    deploy \
    "$APP_REL" \
    "$REL_TAG" \
    "$GCP_CLUSTER_REL" \
    "$CONNECTOR_REL" \
    "$SIMILARITY_REL" \
    "$ENV_STAG"
}

case "$1" in
    build)
        build
    ;;
    deploy-dev)
        deploy-dev
    ;;
    deploy-prod)
        deploy-prod
    ;;
    deploy-rel)
        deploy-rel
    ;;
    *)
        echo "Unknown function: $1"
        echo "Available functions: build, deploy-dev, deploy-prod, deploy-rel"
        exit 1
    ;;
esac