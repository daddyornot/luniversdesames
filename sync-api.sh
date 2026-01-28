# sync-api.sh
cd frontend && npm run api:sync
cd ../admin && npm run api:sync
echo "Les deux frontends sont synchronisés avec le Backend !"
