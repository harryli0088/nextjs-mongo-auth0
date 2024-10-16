import { getClientPromise } from "./mongodb";

export default async function getDb() {
  const client = await getClientPromise();
  return client.db("main");
}