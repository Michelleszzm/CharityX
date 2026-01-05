#!/bin/bash
set -e

REGISTRY="528757795173.dkr.ecr.ap-southeast-1.amazonaws.com"
IMAGE_NAME="charityx-web"
TAG="${1:-latest}"

echo "🔧 Build a mirror image: ${REGISTRY}/${IMAGE_NAME}:${TAG}"
DOCKER_BUILDKIT=1 docker build -t "${REGISTRY}/${IMAGE_NAME}:${TAG}" .

echo "🚀 Push the image to ECR..."
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 528757795173.dkr.ecr.ap-southeast-1.amazonaws.com
docker push "${REGISTRY}/${IMAGE_NAME}:${TAG}"

echo "✅ finish: ${REGISTRY}/${IMAGE_NAME}:${TAG}"