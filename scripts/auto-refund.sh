#!/bin/bash

curl -s -m 900 \
    -H "accept: application/json" \
    -H "Authorization: Bearer <Removed Bearer>" \
    http://localhost:80/api/auto-refund