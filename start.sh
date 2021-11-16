#!/bin/sh

echo 'Migrating database...'
node src/migrations/migrate.js

echo 'Running server...'
node index.js