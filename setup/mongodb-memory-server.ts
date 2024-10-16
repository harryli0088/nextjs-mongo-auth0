import { MongoMemoryServer } from 'mongodb-memory-server';
import { setClientPromise } from "lib/mongodb";


//inspired by https://github.com/ec965/vitest-mongodb/blob/main/vitest-mongodb/src/index.ts
export async function setup() {
  //now we want to set up a local mongo memory server so we can run unit tests without a live connection
  //@ts-ignore
  global.__MONGO_DB__ = await MongoMemoryServer.create();
  //@ts-ignore
  const mongoURI = global.__MONGO_DB__.getUri();
  console.log("mongoURI",mongoURI)
  process.env.MONGODB_URI = mongoURI
  setClientPromise(mongoURI)
}

export async function teardown() {
  //@ts-ignore
  if (globalThis.__MONGO_DB__) {
    console.log("Stopping mongodb memory server");
    //@ts-ignore
    await global.__MONGO_DB__.stop();
  }

  console.log("End of test teardown")
}