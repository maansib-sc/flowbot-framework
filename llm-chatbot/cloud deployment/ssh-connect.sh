#!/bin/bash

HOST=$(cat config.json|jq '.HOST'|sed -e 's/^"//' -e 's/"$//')

ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i key ubuntu@$HOST
