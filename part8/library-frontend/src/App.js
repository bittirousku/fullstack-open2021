import React, { useState, useEffect } from "react"
import { useApolloClient, useLazyQuery, useSubscription } from "@apollo/client"

import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import Notify from "./components/Notify"
import Recommendations from "./components/Recommendations"

import { ME, BOOK_ADDED } from "./queries"

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [getUser, userQueryResult] = useLazyQuery(ME, {
    fetchPolicy: "no-cache", // SUPER IMPORTANT
  })
  // Without the no-cache policy, the result would end up floating
  // around in a zombie state (inside `userQueryResult`), and the
  // user object could not be fetched without a manual refresh
  // TODO: find out the reason for this behaviour

  const client = useApolloClient()

  console.log("RENDERING THE MAIN APP")
  useEffect(() => {
    setToken(localStorage.getItem("library-user-token"))
  }, [token])

  useEffect(() => {
    if (token) {
      console.log("I'm doing getUser and the token is", token)
      getUser()
    }
  }, [token]) // eslint-disable-line

  useEffect(() => {
    if (userQueryResult.data) {
      setCurrentUser(userQueryResult.data.me)
    }
  }, [userQueryResult.data])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      window.alert(
        `Subscription alert (new book added): "${subscriptionData.data.bookAdded.title}"`
      )
      console.log("Subcription alert", subscriptionData)
    },
  })

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

  console.log("token", token)
  console.log("localStorage token", localStorage.getItem("library-user-token"))
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
      />
    </div>
  )
}

export default App
