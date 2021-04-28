/* eslint-disable no-debugger */
import React, { useState, useEffect } from "react"
import Blog from "./components/Blog"

import loginService from "./services/login"

import Login from "./components/Login"
import BlogForm from "./components/BlogForm"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"

import { useDispatch, useSelector } from "react-redux"
import { showNotification } from "./reducers/notificationReducer"
import { initializeBlogs } from "./reducers/blogsReducer"

const App = () => {
  // const [blogs, setBlogs] = useState([])
  // Auth state:
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  // Get all the blogs
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const blogs = useSelector((state) => state.blogs)

  // Get the token (if it exists) and set it as the App state
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogger")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log("logging in with", username, password)
    try {
      let user = await loginService.login({ username, password })
      setUser(user)
      window.localStorage.setItem("loggedBlogger", JSON.stringify(user))
      console.log("Login succeeded:", user)
      dispatch(showNotification("Login succeeded", "info"))
    } catch (err) {
      dispatch(showNotification("Wrong credentials", "error"))
    }
    setUsername("")
    setPassword("")
  }

  const handleLogout = () => {
    console.log("logging out")
    window.localStorage.removeItem("loggedBlogger")
    setUser(null)
    dispatch(showNotification("Logged out!", "info"))
  }

  function sortByLikes(a, b) {
    return a.likes < b.likes ? 1 : a.likes > b.likes ? -1 : 0
  }

  // These functions don't feel good
  // How to do this in an elefant way?
  function showLogin() {
    return (
      <Login
        handleLogin={handleLogin}
        username={username}
        password={password}
        handleUsername={({ target }) => setUsername(target.value)}
        handlePassword={({ target }) => setPassword(target.value)}
      />
    )
  }
  function showBlogForm() {
    return (
      <Togglable buttonLabel="create new">
        {/* using 'function as child' pattern to pass values from parent to child */}
        {(toggleVisibility) => (
          <BlogForm user={user} toggleVisibility={toggleVisibility} />
        )}
      </Togglable>
    )
  }
  function showGreeting() {
    return (
      <div>
        Hello {user.name}! <button onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Blog service</h1>
      <Notification />

      {user === null ? showLogin() : showGreeting()}
      <br />
      {user && showBlogForm()}

      <h2>Blogs</h2>
      {[...blogs].sort(sortByLikes).map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} />
      ))}
    </div>
  )
}

export default App
