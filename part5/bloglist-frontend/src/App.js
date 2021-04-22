import React, { useState, useEffect } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import Login from "./components/Login"
import BlogForm from "./components/BlogForm"
import Notification from "./components/Notification"

const App = () => {
  const [blogs, setBlogs] = useState([])
  // Form state, would be better as an object:
  const [blogTitle, setblogTitle] = useState("")
  const [blogAuthor, setblogAuthor] = useState("")
  const [blogUrl, setblogUrl] = useState("")
  // Auth state:
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  // notification message:
  const [message, setMessage] = useState({})

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

  async function addBlog(event) {
    event.preventDefault()
    let blog = { author: blogAuthor, title: blogTitle, url: blogUrl }
    const created = await blogService.create(blog, user.token)
    setblogAuthor("")
    setblogTitle("")
    setblogUrl("")
    setBlogs(blogs.concat(created))
    showNotification("Added blog", "success")
  }
  // This makes me laugh
  function handleBlogChange(event) {
    event.target.name === "author" && setblogAuthor(event.target.value)
    event.target.name === "title" && setblogTitle(event.target.value)
    event.target.name === "url" && setblogUrl(event.target.value)
  }

  function showNotification(message, type) {
    let msg = { text: message, type: type }
    setMessage(msg)
    setTimeout(() => setMessage(null), 5000)
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
      <BlogForm
        addBlog={addBlog}
        blogTitle={blogTitle}
        blogAuthor={blogAuthor}
        blogUrl={blogUrl}
        handleBlogChange={handleBlogChange}
      />
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
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
