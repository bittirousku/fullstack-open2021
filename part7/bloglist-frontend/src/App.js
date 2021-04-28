/* eslint-disable no-debugger */
import React, { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"

import Login from "./components/Login"
import BlogForm from "./components/BlogForm"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"

import { useDispatch } from "react-redux"
import { showNotification } from "./reducers/notificationReducer"

const App = () => {
  const [blogs, setBlogs] = useState([])
  // Auth state:
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()
  const blogFormRef = useRef()

  // Get all the blogs
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(sortBlogsByLikes(blogs)))
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

  async function addBlog(newBlog) {
    const created = await blogService.create(newBlog, user.token)
    // `created` has not yet been enriched with the user data.
    // It's not there even if we do a GET request with the ID. Why?
    // Have to manually add the username there for the time being
    // Should find a real solution for this though.
    //
    created.user = { username: user.username } // dirty hack
    setBlogs(blogs.concat(created))
    blogFormRef.current.toggleVisibility()
    dispatch(showNotification(`You added '${created.content}'`, "info"))
  }

  async function removeBlog(event) {
    const id = event.target.dataset.blogid
    if (window.confirm(`Do you want to delete blog  ${id}?`)) {
      await blogService.remove(id, user.token)
      setBlogs(sortBlogsByLikes(blogs.filter((blog) => blog.id !== id)))
    }
  }

  async function incrementLikes(id, updateData) {
    // NOTE: we don't want authentication for likes!
    const updatedBlog = await blogService.update(id, updateData)
    //  update the blogs list with the updated likes
    let updatedBlogs = blogs.map((blog) =>
      blog.id === updatedBlog.id ? updatedBlog : blog
    )
    setBlogs(sortBlogsByLikes(updatedBlogs))
    return updatedBlog
  }

  function sortBlogsByLikes(blogs) {
    // Is this really the way to sort arrays in Javascript?
    // I would rather perhaps use lodash
    return [...blogs].sort((b1, b2) =>
      b1.likes < b2.likes ? 1 : b1.likes > b2.likes ? -1 : 0
    )
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
      <Notification />

      {user === null ? showLogin() : showGreeting()}
      <br />
      {user && showBlogForm()}

      <h2>Blogs</h2>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          incrementLikes={incrementLikes}
          handleDelete={removeBlog}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
