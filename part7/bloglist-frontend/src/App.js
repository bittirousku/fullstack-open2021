/* eslint-disable no-debugger */
import React, { useEffect } from "react"
import Blog from "./components/Blog"

import Login from "./components/Login"
import BlogForm from "./components/BlogForm"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"

import { useDispatch, useSelector } from "react-redux"
import { showNotification } from "./reducers/notificationReducer"
import { initializeBlogs } from "./reducers/blogsReducer"
import { loginByExistingToken, logout } from "./reducers/loginReducer"

const App = () => {
  const dispatch = useDispatch()

  // Get all the blogs
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.login)

  // Get the token (if it exists) and set it as the App state
  useEffect(() => {
    dispatch(loginByExistingToken())
  }, [])

  function sortByLikes(a, b) {
    return a.likes < b.likes ? 1 : a.likes > b.likes ? -1 : 0
  }

  function handleLogout() {
    dispatch(logout())
    dispatch(showNotification("Logged out!", "info"))
  }

  // These functions don't feel good
  // How to do this in an elefant way?
  function showLogin() {
    return <Login />
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
