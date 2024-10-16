# Next.JS MongoDB Test

## Next.JS and MongoDB tutorial

https://www.mongodb.com/developer/languages/javascript/nextjs-with-mongodb/

## Auth0 Next.js Tutorial

https://auth0.com/docs/quickstart/webapp/nextjs

## Next.JS Email Auth Tutorial (no longer used, check the git commit history 7b12d08eb3c61b7f57ba86854e373d9ccd03b7b0)

https://itnext.io/next-js-passwordless-email-authentication-with-nextauth-mongodb-397e558bdcf0

## Create a Search Index in MongoDB

https://www.mongodb.com/docs/atlas/atlas-search/tutorial/create-index/

### Autocomplete search index

https://www.mongodb.com/docs/atlas/atlas-search/tutorial/autocomplete-tutorial/

### Store Files to Azure

https://learn.microsoft.com/en-us/azure/developer/javascript/tutorial/browser-file-upload-azure-storage-blob

### Autogenerating Checkbook.io SDK

```
npx api install @checkbook-docs/v3.1#24gbvlge9o8hs 
```

### Auth0 Machine to Machine API Permissions

read:client_grants
create:client_grants
delete:client_grants
update:client_grants
read:users
read:roles

## Libraries
`@auth0/nextjs-auth0`: https://github.com/auth0/nextjs-auth0

`api`: https://api.readme.dev/docs

`mongodb-memory-server`: https://github.com/nodkz/mongodb-memory-server

`next-auth`: https://next-auth.js.org/

`node-fetch`: https://www.npmjs.com/package/node-fetch

`react-bootstrap`: https://react-bootstrap.github.io/

`react-bootstrap-typeahead`: http://ericgio.github.io/react-bootstrap-typeahead/

`react-email`: https://react.email/docs/introduction

`react-fontawesome`: https://fontawesome.com/

`react-hook-form`: https://www.npmjs.com/package/react-hook-form

`vitest`: https://vitest.dev/

## Misc

### Generating MongoDB User Passwords
Make sure to use alphanumeric characters. If you add weird escape characters, ex `<`, then you'll encounter errors when trying to access Mongo and when building on Vercel.

### Install playwright
I don't know why this doesn't install automatically, but you need to run this to get playwright to work
```
npx playwright install
```

### Importing stuff from absolute paths with `ts-node`
https://typestrong.org/ts-node/docs/paths

In `tsconfig.json`:
```json
{
  "ts-node": {
    // Do not forget to `npm i -D tsconfig-paths`
    "require": ["tsconfig-paths/register"]
  }
}
```