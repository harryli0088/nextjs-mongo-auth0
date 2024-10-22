import { NextApiRequest, NextApiResponse } from "next"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import { Ajv, JSONSchemaType } from "ajv";
import { MAX_LENGTH } from "lib/consts";
import { getTodosCollection } from "lib/todo/getTodosCollection";
import getDb from "lib/getDb";
import { ObjectId } from "mongodb";
import { makeNewTodo } from "lib/todo/makeNewTodo";

export type CreateTodoRequestType = {
  name: string,
}
const CREATE_TODO_REQUEST_SCHEMA: JSONSchemaType<CreateTodoRequestType> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: MAX_LENGTH,
      errorMessage: {
        minLength: 'Name is too short',
        maxLength: 'Name is too long',
      },
    },
  },
  required: ["name"],
  additionalProperties: false
}
export type CreateTodoResponseType = any

export type UpdateTodoRequestType = {
  _id: string,
  done: boolean,
  name: string,
}
const UPDATE_TODO_REQUEST_SCHEMA: JSONSchemaType<UpdateTodoRequestType> = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      minLength: 1,
      maxLength: MAX_LENGTH,
      errorMessage: {
        minLength: '_id is too short',
        maxLength: '_id is too long',
      },
    },
    done: {
      type: "boolean",
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: MAX_LENGTH,
      errorMessage: {
        minLength: 'Name is too short',
        maxLength: 'Name is too long',
      },
    },
  },
  required: ["_id","done","name"],
  additionalProperties: false
}
export type UpdateTodoResponseType = any

export type GetDeleteTodoRequestType = {
  _id: string,
}
const GET_DELETE_TODO_REQUEST_SCHEMA: JSONSchemaType<GetDeleteTodoRequestType> = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      minLength: 1,
      maxLength: MAX_LENGTH,
      errorMessage: {
        minLength: '_id is too short',
        maxLength: '_id is too long',
      },
    },
  },
  required: ["_id"],
  additionalProperties: false
}
export type DeleteTodoResponseType = {}


const ajv = new Ajv()
export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await getSession(req, res)
      const userId = session?.user.userId
      if(!userId) return res.status(401).end()

      //create Todo
      if (req.method === "POST") {
        const data = req.body as CreateTodoRequestType
        const validate = ajv.compile(CREATE_TODO_REQUEST_SCHEMA)
        if(!validate(data)) {
          const firstError = validate?.errors?.[0]
          return res.status(400).json({ error: `Validation Error: ${firstError?.instancePath.slice(1)} ${firstError?.message}` })
        }

        const result = await getTodosCollection(await getDb()).insertOne(makeNewTodo({...data,userId}))
        if(result.insertedId) {
          const response:CreateTodoResponseType = result
          return res.status(200).json(response)
        }
        throw new Error("There was an error adding your Todo")
      }
      //update Todo
      else if (req.method === "PUT") {
        const data = req.body as UpdateTodoRequestType
        const validate = ajv.compile(UPDATE_TODO_REQUEST_SCHEMA)
        if(!validate(data)) {
          const firstError = validate?.errors?.[0]
          return res.status(400).json({ error: `Validation Error: ${firstError?.instancePath.slice(1)} ${firstError?.message}` })
        }

        const results = await getTodosCollection(await getDb()).findOneAndUpdate({
          _id: new ObjectId(data._id),
        },{
          $set: {
            done: data.done,
            name: data.name,
          }
        },{returnDocument: "after", upsert: false})
        if(results.value) {
          const response:UpdateTodoResponseType = results.value
          return res.status(200).json(response)
        }
        return res.status(404).end()
      }
      //delete Todo
      else if (req.method === "DELETE") {
        const data = req.body as GetDeleteTodoRequestType
        const validate = ajv.compile(GET_DELETE_TODO_REQUEST_SCHEMA)
        if(!validate(data)) {
          const firstError = validate?.errors?.[0]
          return res.status(400).json({ error: `Validation Error: ${firstError?.instancePath.slice(1)} ${firstError?.message}` })
        }

        const results = await getTodosCollection(await getDb()).deleteOne({
          _id: new ObjectId(data._id),
        })
        if(results.deletedCount > 0) {
          const response:DeleteTodoResponseType = {}
          return res.status(200).json(response)
        }
        return res.status(404).end()
      }
      //get Todo
      else if (req.method === "GET") {
        const data = req.query as GetDeleteTodoRequestType
        const validate = ajv.compile(GET_DELETE_TODO_REQUEST_SCHEMA)
        if(!validate(data)) {
          const firstError = validate?.errors?.[0]
          return res.status(400).json({ error: `Validation Error: ${firstError?.instancePath.slice(1)} ${firstError?.message}` })
        }

        const results = await getTodosCollection(await getDb()).findOne({
          _id: new ObjectId(data._id),
          userId
        })
        if(results) {
          return res.status(200).json(results)
        }
        return res.status(404).end()
      }
      //we don't support this method
      return res.status(404).end()
    }
    catch(error) {
      return res.status(500).json({ error: `${error}` })
    }
  }
)
