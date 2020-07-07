#!/bin/bash
. ~/.nvm/nvm.sh

nvm use
npm run build && npm run deploy
