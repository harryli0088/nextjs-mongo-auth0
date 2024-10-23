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

import { CreateTodoRequestType, CreateTodoResponseType, GetDeleteTodoRequestType, UpdateTodoRequestType, UpdateTodoResponseType } from './api/todo';
import { WithId } from 'mongodb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Badge } from 'react-bootstrap';
import { useUser } from '@auth0/nextjs-auth0/client';

import styles from "./index.module.scss"

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
  const { user, error, isLoading } = useUser()
  if(error) console.error(error)

  const content = (() => {
    if(isLoading) {
      return <p>Loading...</p>
    }
    else if(user) {
      return (
        <div>
          <DisplayTodos/>
          <hr/>
          <a href="/api/auth/logout"><Button>Logout</Button></a>
        </div>
      )
    }
    else {
      return <p><a href="/api/auth/login"><Button>Login</Button></a></p>
    }
  })()

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
        </Container>
      </section>

      <section>
        <Container>
          {content}
        </Container>
      </section>
    </>
  )
}

function DisplayTodos() {
  //<data (mutation function return type), error, variables (mutation function data input), context>
  const {data, error, isLoading, refetch} = useQuery<GetTodosResponseType, ApiErrorType>({
    queryKey: ["todos"],
    queryFn: async () => {
      const options = {
        ...FETCH_OPTIONS,
        method: "GET",
      }
      delete options.body
      const response = await fetch(`/api/todos`, options).then(handleFetch) as GetTodosResponseType
      return response.sort((a,b) => {
        if(a.done && !b.done) {
          return 1
        }
        else if(b.done && !a.done) {
          return -1
        }
        return Math.sign(b.lastUpdated - a.lastUpdated)
      })
    },
    staleTime: Infinity
  })

  const content = (() => {
    if(isLoading) {
      return <p>Loading...</p>
    }
    else if(error) {
      return <p>{error.message}</p>
    }
    else if(data?.length) {
      return (
        <>
          <br/>
          <Row>
            <Col><p><b>Status</b></p></Col>
            <Col><p><b>Todo</b></p></Col>
            <Col><p><b>Last Updated</b></p></Col>
            <Col><p><b>Created At</b></p></Col>
            <Col></Col>
          </Row>
          {data?.map((todo, i) => <Todo key={todo._id.toString()} refetch={refetch} todo={todo}/>)}
        </>
      )
    }
    return <p><b>You have no Todos</b></p>
  })()

  return (
    <>
      <CreateTodoForm refetch={refetch}/>
      <hr/>
      {content}
    </>
  )
}

function CreateTodoForm({refetch}:{refetch:() => any}) {
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
        body: JSON.stringify(body)
      }
      return await fetch(`/api/todo`, options).then(handleFetch)
    },
    onSuccess: () => {
      setNewTodo("")
      refetch()
    }
  })

  const handleAddNewTodo = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate()
  }

  return (
    <Form onSubmit={handleAddNewTodo}>
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

function Todo({
  refetch,
  todo:{
    _id,
    createdAt,
    done,
    lastUpdated,
    name,
  }
}:{
  refetch: () => any,
  todo: WithId<TodoType>
}) {
  //<data (mutation function return type), error, variables (mutation function data input), context>
  const {error:updateError, isLoading:updateIsLoading, mutate:update} = useMutation<UpdateTodoResponseType, ApiErrorType>({
    mutationFn: async () => {
      const body:UpdateTodoRequestType = {
        _id: _id.toString(),
        done: !done,
        name,
      }
      const options = {
        ...FETCH_OPTIONS,
        method: "PUT",
        body: JSON.stringify(body)
      }
      return await fetch(`/api/todo`, options).then(handleFetch)
    },
    onSuccess: () => {
      refetch()
    }
  })


  //<data (mutation function return type), error, variables (mutation function data input), context>
  const {error:deleteError, isLoading:deleteIsLoading, mutate:deleteTodo} = useMutation<UpdateTodoResponseType, ApiErrorType>({
    mutationFn: async () => {
      const body:GetDeleteTodoRequestType = {
        _id: _id.toString(),
      }
      const options = {
        ...FETCH_OPTIONS,
        method: "DELETE",
        body: JSON.stringify(body)
      }
      return await fetch(`/api/todo`, options).then(handleFetch)
    },
    onSuccess: () => {
      refetch()
    }
  })

  return (
    <div>
      <Row>
        <Col><Badge className={styles.badge} bg={done?"secondary":"warning"} onClick={() => update()}>{done ? "Done" : "Todo"}</Badge></Col>
        <Col><p>{name}</p></Col>
        <Col><p>{new Date(lastUpdated).toDateString()}</p></Col>
        <Col><p>{new Date(createdAt).toDateString()}</p></Col>
        <Col><p><FontAwesomeIcon className={styles.icon} icon={faTimes} onClick={() => deleteTodo()}/></p></Col>
      </Row>
      {updateError && <ErrorMessage>{updateError.message}</ErrorMessage>}
      {deleteError && <ErrorMessage>{deleteError.message}</ErrorMessage>}
    </div>
  )
}

async function handleFetch(res: Response) {
  if(!res.ok) throw new Error(`${res.status} ${res.statusText} ${((await res.json() as ApiErrorType).message)}`)
  return res.json()
}