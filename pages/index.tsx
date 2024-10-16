import React, { FormEvent, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

import { HeadMeta } from 'components/HeadMeta';

import { ApiErrorType } from 'types/todo';
import { GetTodosResponseType } from './api/todos';

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
  const [newTodo, setNewTodo] = useState<string>("")
  const handleAddNewTodo = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    //TODO
  }

  //<data (mutation function return type), error, variables (mutation function data input), context>
  const {data} = useQuery<GetTodosResponseType, ApiErrorType>({
    queryKey: ["Navbar-USER_IS_ADMIN"],
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

          <Form onChange={handleAddNewTodo}>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="New Todo"
                aria-label="New Todo"
                aria-describedby="add-todo-button"
                onChange={e => setNewTodo(e.target.value)}
                value={newTodo}
              />
              <Button variant="primary" type="submit" id="add-todo-button">
                Add
              </Button>
            </InputGroup>
          </Form>

          <hr/>
        </Container>
      </section>

      <section>
        <Container>
          {data?.map(({createdAt, done, lastUpdated, name}, i) => {
            return (
              <Row key={i}>
                <Col>{done}</Col>
                <Col>{name}</Col>
                <Col>{lastUpdated}</Col>
                <Col>{createdAt}</Col>
              </Row>
            )
          })}
          {!data && <p><b>You have no Todos!</b></p>}
        </Container>
      </section>
    </>
  )
}