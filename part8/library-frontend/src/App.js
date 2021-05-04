import React, { useState, useEffect } from "react"
import { useApolloClient, useLazyQuery } from "@apollo/client"

import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import Notify from "./components/Notify"
import Recommendations from "./components/Recommendations"

import { ME } from "./queries"

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const [getUser, userQueryResult] = useLazyQuery(ME)
  const [currentUser, setCurrentUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    if (token) {
      // Important to make this conditional
      // otherwise the user object would not get fetched
      // the first time the user is logged in, only after refresh
      setToken(localStorage.getItem("library-user-token"))
      getUser()
    }
  }, [token]) // eslint-disable-line

  useEffect(() => {
    if (userQueryResult.data) {
      setCurrentUser(userQueryResult.data.me)
    }
  }, [userQueryResult])

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    setCurrentUser(null)
    localStorage.clear()
    client.resetStore()
    setPage("authors")
  }

  console.log("userQueryResult.data", userQueryResult.data)
  console.log("currentUser", currentUser)
  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && (
          <button onClick={() => setPage("recommend")}>recommend</button>
        )}
        {token && <button onClick={logout}>Logout</button>}

        {currentUser && <i> {currentUser.username} logged in</i>}
        {!token && <button onClick={() => setPage("login")}>Login</button>}
      </div>

      {!token && <Notify errorMessage={errorMessage} />}
      <Authors show={page === "authors"} token={token} />

      {page === "books" && <Books show={page === "books"} token={token} />}

      <NewBook show={page === "add"} />
      {currentUser && page === "recommend" && (
        <Recommendations show={page === "recommend"} user={currentUser} />
      )}

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setError={notify}
        setPage={setPage}
        getUser={getUser}
      />
    </div>
  )
}

export default App
