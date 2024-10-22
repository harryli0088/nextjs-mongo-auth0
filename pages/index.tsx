import React, { FormEvent, useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

import { HeadMeta } from 'components/HeadMeta';

import { ApiErrorType, TodoType } from 'types/todo';
import { GetTodosResponseType } from './api/todos';

import styles from "./index.module.scss"
import { CreateTodoRequestType, CreateTodoResponseType, GetDeleteTodoRequestType, UpdateTodoRequestType, UpdateTodoResponseType } from './api/todo';

const FETCH_OPTIONS:RequestInit = {
  mode: 'cors', // no-cors, *cors, same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, *same-origin, omit
  headers: {
    'Content-Type': 'application/json'
  },
  redirect: 'follow', // manual, *follow, error
  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
} as const

export default function Home() {
  //<data (mutation function return type), error, variables (mutation function data input), context>
  const {data} = useQuery<GetTodosResponseType, ApiErrorType>({
    queryKey: ["todos"],
    queryFn: async () => {
      const options = {
        ...FETCH_OPTIONS,
        method: "GET",
      }
      delete options.body
      return await fetch(`todos`, options).then((res) => res.json())
    },
    staleTime: Infinity
  })

  return (
    <>
      <HeadMeta/>

      <section>
        <Container>
          <br/>
          <br/>
          <h1>Next.js MongoDB Auth0 Test Todo Application</h1>
          <br/>
          <br/>

          <CreateTodoForm/>

          <hr/>
        </Container>
      </section>

      <section>
        <Container>
          {data?.map((todo, i) => <Todo key={i} todo={todo}/>)}
          {!data && <p><b>You have no Todos!</b></p>}
        </Container>
      </section>
    </>
  )
}

function CreateTodoForm() {
  const [newTodo, setNewTodo] = useState<string>("")

  //<data (mutation function return type), error, variables (mutation function data input), context>
  const {error, isLoading, mutate} = useMutation<CreateTodoResponseType, ApiErrorType>({
    mutationFn: async () => {
      const body:CreateTodoRequestType = {
        name: newTodo
      }
      const options = {
        ...FETCH_OPTIONS,
        method: "POST",
        body: JSON.stringify({body})
      }
      return await fetch(`todos`, options).then((res) => res.json())
    },
  })

  const handleAddNewTodo = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate()
  }

  return (
    <Form onChange={handleAddNewTodo}>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="New Todo"
          aria-label="New Todo"
          aria-describedby="add-todo-button"
          onChange={e => setNewTodo(e.target.value)}
          value={newTodo}
        />
        <Button variant="primary" type="submit" id="add-todo-button" disabled={isLoading}>
          Add
        </Button>
      </InputGroup>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Form>
  )
}

function ErrorMessage({children}:{children:React.ReactNode}) {
  return <p style={{color:"red"}}>{children}</p>
}

function Todo({todo:{
  _id,
  createdAt,
  done,
  lastUpdated,
  name,
}}:{todo: WithId<TodoType>}) {
  const [editMode, setEditMode] = useState<boolean>(false)

  //<data (mutation function return type), error, variables (mutation function data input), context>
  const {error:updateError, isLoading:updateIsLoading, mutate:update} = useMutation<UpdateTodoResponseType, ApiErrorType>({
    mutationFn: async () => {
      const body:UpdateTodoRequestType = {
        _id,
        done: !done,
        name,
      }
      const options = {
        ...FETCH_OPTIONS,
        method: "PUT",
        body: JSON.stringify({body})
      }
      return await fetch(`todos`, options).then((res) => res.json())
    },
  })


  //<data (mutation function return type), error, variables (mutation function data input), context>
  const {error:deleteError, isLoading:deleteIsLoading, mutate:deleteTodo} = useMutation<UpdateTodoResponseType, ApiErrorType>({
    mutationFn: async () => {
      const body:GetDeleteTodoRequestType = {
        _id,
      }
      const options = {
        ...FETCH_OPTIONS,
        method: "DELETE",
        body: JSON.stringify({body})
      }
      return await fetch(`todos`, options).then((res) => res.json())
    },
  })

  return (
    <div>
      <Row>
        <Col><Badge onClick={() => update()}>{done}</Badge></Col>
        <Col><p>{name}</p></Col>
        <Col><p>{new Date(lastUpdated).toDateString()}</p></Col>
        <Col><p>{new Date(createdAt).toDateString()}</p></Col>
        <Col><FontAwesomeIcon icon={faTimes} onClick={() => deleteTodo()}/></Col>
      </Row>
      {updateError && <ErrorMessage>{updateError.error}</ErrorMessage>}
      {deleteError && <ErrorMessage>{deleteError.error}</ErrorMessage>}
    </div>
  )
}