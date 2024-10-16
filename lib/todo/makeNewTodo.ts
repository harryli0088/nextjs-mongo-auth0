import { TodoType } from "types/todo";

export function makeNewTodo(args:{
  name: string,
  userId: string,
}):TodoType {
  const now = new Date().getTime()

  return {
    ...args,
    createdAt: now,
    done: false,
    lastUpdated: now,
  }
}