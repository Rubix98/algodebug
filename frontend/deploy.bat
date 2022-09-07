@echo off
npm run build&&cd dist&&git init&&git add -A&&git commit -m "Deploy"&&git push -f https://github.com/Rubix98/algoview.git master:gh-pages&&cd ..