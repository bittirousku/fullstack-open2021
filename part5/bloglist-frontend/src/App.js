import React, { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import Login from "./components/Login"
import BlogForm from "./components/BlogForm"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"

const App = () => {
  const [blogs, setBlogs] = useState([])
  // Auth state:
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  // notification message:
  const [message, setMessage] = useState({})

  const blogFormRef = useRef()

  // Get all the blogs
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

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
      showNotification("Login succeeded", "success")
    } catch (err) {
      showNotification("Wrong credentials", "error")
    }
    setUsername("")
    setPassword("")
  }

  const handleLogout = (event) => {
    console.log("logging out")
    window.localStorage.removeItem("loggedBlogger")
    setUser(null)
    showNotification("Logged out!", "success")
  }

  async function addBlog(newBlog) {
    const created = await blogService.create(newBlog, user.token)
    setBlogs(blogs.concat(created))
    blogFormRef.current.toggleVisibility()
    showNotification("Added blog", "success")
  }

  function showNotification(message, type) {
    let msg = { text: message, type: type }
    setMessage(msg)
    setTimeout(() => setMessage(null), 5000)
  }

  async function incrementLikes(id, updateData) {
    return await blogService.update(id, updateData, user.token)
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
      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
    )
  }
  // My react components start turning into functions... not cool?
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
      {message && <Notification message={message} />}

      {user === null ? showLogin() : showGreeting()}
      <br />
      {user && showBlogForm()}

      <h2>Blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} incrementLikes={incrementLikes} />
      ))}
    </div>
  )
}

export default App
