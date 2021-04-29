import React, { useState } from "react"
import { useDispatch } from "react-redux"

import { Form, Button } from "react-bootstrap"

import { loginByCredentials } from "../reducers/loginReducer"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()

  function handleLogin(event) {
    event.preventDefault()
    console.log("logging in with", username, password)
    dispatch(loginByCredentials(username, password))
    setUsername("")
    setPassword("")
  }

  return (
    <div>
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <div>
            <Form.Label>username</Form.Label>
            <Form.Control
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Form.Label>password</Form.Label>

            <Form.Control
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button variant="primary" id="submit" type="submit">
            login
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default Login
