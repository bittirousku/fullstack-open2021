import React from "react"

const Login = ({
  handleLogin,
  username,
  password,
  handleUsername,
  handlePassword,
}) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username} // why does react want this here? It works fine without...
            name="Username"
            onChange={handleUsername}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={handlePassword}
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
