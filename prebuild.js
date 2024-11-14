console.log("--- Prebuild script is running ---")

// //load the envrironment variables
// const loadEnvConfig = require('@next/env').loadEnvConfig
// const projectDir = process.cwd()
// loadEnvConfig(projectDir)

// //list of keys we want to be set
// const KEYS = [
//   "AUTH0_BASE_URL",
//   "AUTH0_CLIENT_ID",
//   "AUTH0_CLIENT_SECRET",
//   "AUTH0_ISSUER_BASE_URL",
//   "AUTH0_SECRET",
//   "MONGODB_URI",
// ]

// KEYS.forEach((key) => {
//   if(process.env[key]) { //if the env var is truthy (ie a non-empty string)
//     console.log(`Environment variable ${key} is set as ${process.env[key]}`)
//   }
//   else { //else the env var is not set
//     throw new Error(`Environment variable ${key} is invalid and ${process.env[key]} with typeof ${typeof process.env[key]}`)
//   }
// })



console.log("--- Prebuild script is done ---")
