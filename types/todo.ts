export type TodoType = {
  createdAt: number,
  done: boolean,
  lastUpdated: number,
  name: string,
  userId: string,
}

export type ApiErrorType = { message: string }