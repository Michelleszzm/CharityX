#!/bin/bash

APP_NAME=charityx-service
ECR_REPOSITORY=528757795173.dkr.ecr.ap-southeast-1.amazonaws.com
FEISHU_URL=https://open.larksuite.com/open-apis/bot/v2/hook/d664c7c3-2451-457d-af81-c363f7dd4fa5

DEPLOYMENT_NAME=$APP_NAME-deploy
TAG=$1
ACTIVE_PROFILE=$2

NEW_JAR_NAME=$APP_NAME-$TAG.jar
ENV=$(echo $TAG | cut -d'-' -f1)

# params check
if [ -z "$1" ]; then
    echo "miss 1st tagName param. example: ./build.sh tagName activeProfile"
    exit 1
fi
if [ -z "$2" ]; then
    echo "miss 2nd activeProfile param. example: ./build.sh tagName activeProfile"
    exit 1
fi

# 1. git pull and checkout Tag
git clean -f
git fetch --tags
git checkout $TAG

tag_hash=$(git rev-list -n 1 tags/$TAG)
current_head_hash=$(git rev-parse HEAD)
echo $tag_hash $current_head_hash
if [[ $tag_hash =~ $current_head_hash ]]
then
  echo `date`--'switch to Tag：'$TAG >> build.log
else
  echo `date`--'Tag not matched：'$TAG >> build.log
  exit 1
fi

aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 528757795173.dkr.ecr.ap-southeast-1.amazonaws.com

# 2. mvn build
#source /etc/profile
#mvn -U clean package -Dmaven.test.skip=true \
#&& echo `date`--jarBuildOK >> build.log

# 3. docker image build
#aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin $ECR_REPOSITORY
#cp $(find . | grep .jar$) $NEW_JAR_NAME && \
docker build -f Dockerfile --build-arg NEW_JAR_NAME=$NEW_JAR_NAME --build-arg ACTIVE_PROFILE=$ACTIVE_PROFILE -t $ECR_REPOSITORY/$APP_NAME:$TAG . && \
echo `date`--imageBuildOK >> build.log

# 4. push to remote ECR
docker push $ECR_REPOSITORY/$APP_NAME:$TAG \
&& echo "$(date) -- pushImageToAWSEcrOK" >> build.log

########################################
########################################

echo "$(date) -- start clean local images" >> build.log

docker images $ECR_REPOSITORY/$APP_NAME --format "{{.Repository}}:{{.Tag}}" \
  | grep -v ":$TAG$" \
  | xargs -r docker rmi -f

docker image prune -f

echo "$(date) -- clean local images finished" >> build.log

########################################

# 5. Notice to feishu
curl -X POST -H "Content-Type: application/json" \
    -d '{"msg_type":"text","content":{"text":"charityXBuildSucceed: '$APP_NAME:$TAG'"}}' $FEISHU_URL

# 6. update deployment Tag
if [[ 'release' =~ $ENV ]]
then
  FEISHU_MSG='charityXDeploymentNotice:PleaseManualUpdateDeployImageIfEnvIsRelease'
else
  kubectl set image -n qa deployment/$APP_NAME-deploy $APP_NAME-container=$ECR_REPOSITORY/$APP_NAME:$TAG
  FEISHU_MSG='charityXDeploymentUpdating:'$APP_NAME:$TAG
fi
echo $FEISHU_MSG
curl -X POST -H "Content-Type: application/json" \
    -d '{"msg_type":"text","content":{"text":"'$FEISHU_MSG'"}}' $FEISHU_URL