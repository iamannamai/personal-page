#!/usr/bin/env bash

set -e

# If our deploy fails partway through we want to clean up after ourselves.
# This next block is like a try/catch for our entire script.

# We trap any program EXIT and run this function.
# Whether the deploy succeeds or fails, we'll clean up the deploy branch.

function cleanup_at_exit {
  # return to your master branch
  git checkout master

  # remove the deploy branch
  git branch -D deploy
  git branch -D gh-pages
}
trap cleanup_at_exit EXIT

# checks out a new branch called "deploy". Note that the name "deploy" here isn't magical,
# but it needs to match the name of the branch we specify when we push to our heroku remote.
git checkout -b deploy

# webpack will run in "production mode"
webpack -p

node-sass scss/main.scss public/assets/style.css

# "force" add the otherwise gitignored build files
git add -f public/bundle.js public/bundle.js.map

# create a commit, even if nothing changed
git commit --allow-empty -m 'Deploying'

# push your local "deploy" branch to the "master" branch on heroku
# git subtree push --prefix public origin gh-pages
git subtree split --prefix public -b gh-pages
git push -f origin gh-pages:gh-pages
