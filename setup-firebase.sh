#!/bin/bash

if [ -n "$GOOGLE_APPLICATION_CREDENTIALS_JSON" ]; then
  echo "$GOOGLE_APPLICATION_CREDENTIALS_JSON" | node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2))" > /tmp/firebase-credentials.json
  export GOOGLE_APPLICATION_CREDENTIALS="/tmp/firebase-credentials.json"
  echo "Firebase credentials configured successfully"
else
  echo "Warning: GOOGLE_APPLICATION_CREDENTIALS_JSON not found in environment"
fi
