#!/bin/sh

echo -e "推送小书-->github\n"

cd /Users/dillonliang/Desktop/dillon/me/mybook/

git add .
git commit -m "$1"
git push origin master

