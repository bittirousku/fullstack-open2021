/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Switch, Route, useRouteMatch } from "react-router-dom"

import Login from "./components/Login"
import BlogList from "./components/BlogList"
import BlogForm from "./components/BlogForm"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
import UserList from "./components/UserList"
import User from "./components/User"
import Blog from "./components/Blog"

import { showNotification } from "./reducers/notificationReducer"
import { initializeBlogs } from "./reducers/blogsReducer"
import { initializeUsers } from "./reducers/usersReducer"
import { loginByExistingToken, logout } from "./reducers/loginReducer"

const App = () => {
  const dispatch = useDispatch()

  // Get all the blogs and users
  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  // Get the token (if it exists) and set it as the App state
  useEffect(() => {
    dispatch(loginByExistingToken())
  }, [])

  const user = useSelector((state) => state.login)
  const users = useSelector((state) => state.users)
  const blogs = useSelector((state) => state.blogs)

  // Where to put these route matchers? Here?
  // Get user for a match
  const userMatch = useRouteMatch("/users/:id")
  const matchedUser = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null

  // Get blogs for a match
  const blogMatch = useRouteMatch("/blogs/:id")
  const matchedBlog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null

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

      <Switch>
        <Route path="/users/:id">
          <User user={matchedUser} />
        </Route>
        <Route path="/blogs/:id">
          <Blog blog={matchedBlog} user={user} />
        </Route>
        <Route path="/users">{user && <UserList />}</Route>
        <Route path="/">
          <BlogList />
        </Route>
      </Switch>
    </div>
  )
}

export default App
