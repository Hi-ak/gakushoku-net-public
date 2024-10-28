#!/bin/bash

cd $(dirname $0)

cd ..

source .env

npx supabase db reset

npx prisma migrate deploy

psql $DIRECT_URL <./db/seed.sql
