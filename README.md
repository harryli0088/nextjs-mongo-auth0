# Next.JS MongoDB Auth0 Test

## Next.JS and MongoDB tutorial

https://www.mongodb.com/developer/languages/javascript/nextjs-with-mongodb/

## Auth0 Next.js Tutorial

https://auth0.com/docs/quickstart/webapp/nextjs

## Create a Search Index in MongoDB

https://www.mongodb.com/docs/atlas/atlas-search/tutorial/create-index/

### Autocomplete search index

https://www.mongodb.com/docs/atlas/atlas-search/tutorial/autocomplete-tutorial/

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