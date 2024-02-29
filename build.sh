rm -rf ./dist
npm run build
rm -rf ./dist/.DS_Store
zip -r ./dist/dist.zip ./dist/*
open ./dist/
