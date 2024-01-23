# Github to Gitea

simple node script to migrate all your github repos to gitea

## Intro

- migrate all your own repos
- bypass exists on gitea (same repo name)
- description, issues, labels, pull_requests, releases, wiki are migrated by default
- visibility followed github's setting

## Useage

1. git clone
2. npm intall
3. fill necessary variables in `index.js` (token, gitea server url, github username)
4. `npm start` or `node index.js`
