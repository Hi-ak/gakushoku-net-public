#!/bin/bash
zip -r "deploy${1}.zip" . -x "make-deploy.sh" -x ".git/*" -x "node_modules/*" -x ".next/*"