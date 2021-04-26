import React from "react"
import { useDispatch } from "react-redux"
import { create } from "../reducers/anecdoteReducer"
import { showNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  async function addAnecdote(event) {
    event.preventDefault()
    let text = event.target.text.value
    event.target.text.value = ""

    dispatch(create(text))
    dispatch(showNotification(`You added '${text}'`))
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="text" />
        </div>
        <button type="submit">create</button>
      </form>
      <br />
    </div>
  )
}

export default AnecdoteForm
