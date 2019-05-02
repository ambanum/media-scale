#!/bin/bash
set -e

### Configuration ###

APP_DIR=/home/cloud/media-scale
GIT_URL=git@github.com:ambanum/media-scale.git

### Automation steps ###

set -x

eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_rsa_deploy_key_media-scale
# Pull latest code
if [[ -e $APP_DIR ]]; then
  cd $APP_DIR
  git pull
else
  git clone $GIT_URL $APP_DIR
  cd $APP_DIR
fi

# Install dependencies
npm install --production
npm prune --production

# Restart app
$ PORT=3030 forever restart app/server.js || PORT=3030 forever start app/server.js
