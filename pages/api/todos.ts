import { NextApiRequest, NextApiResponse } from "next"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import { getTodosCollection } from "lib/todo/getTodosCollection";
import getDb from "lib/getDb";
import { TodoType } from "types/todo";

export type GetTodosResponseType = TodoType[]

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (req.method === "GET") {
        const session = await getSession(req, res)
        const userId = session?.user.userId
        if(!userId) return res.status(401).end()

        //get the Todos that belong to this user
        const results:GetTodosResponseType = await getTodosCollection(await getDb()).find({
          userId
        }).toArray()

        //send the results back to the client
        return res.status(200).json(results)
      }
      //we don't support this method
      return res.status(404).end()
    }
    catch(error) {
      return res.status(500).json({ error: `${error}` })
    }
  }
)
