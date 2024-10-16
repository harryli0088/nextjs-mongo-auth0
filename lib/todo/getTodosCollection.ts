import { Db } from "mongodb";
import { TodoType } from "types/todo";

export function getTodosCollection(db: Db) {
  return db.collection<TodoType>("todos")
}