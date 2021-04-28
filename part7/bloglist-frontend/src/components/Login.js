import React, { useState } from "react"
import { useDispatch } from "react-redux"

import { showNotification } from "../reducers/notificationReducer"
import { loginByCredentials } from "../reducers/loginReducer"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()

  function handleLogin(event) {
    event.preventDefault()
    try {
      console.log("logging in with", username, password)
      dispatch(loginByCredentials(username, password))
      console.log("Login succeeded!")
    } catch (err) {
      dispatch(showNotification("Wrong credentials", "error"))
    }
    setUsername("")
    setPassword("")
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button id="submit" type="submit">
          login
        </button>
      </form>
    </div>
  )
}

export default Login
