import React from "react"
import { useDispatch } from "react-redux"
import { add } from "../reducers/anecdoteReducer"
import {
  addNotification,
  removeNotification,
} from "../reducers/notificationReducer"
import anecdoteService from "../services/anecdotes"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  // How to remove the duplication of this function?
  function showNotification(text) {
    dispatch(addNotification(text))
    setTimeout(() => dispatch(removeNotification()), 5000)
  }

  async function addAnecdote(event) {
    event.preventDefault()
    let text = event.target.text.value
    event.target.text.value = ""

    const newAnecdote = await anecdoteService.createNew(text)

    dispatch(add(newAnecdote))
    showNotification(`You added '${text}'`)
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
