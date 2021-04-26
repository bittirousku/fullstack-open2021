import React from "react"
import { useDispatch } from "react-redux"
import { add } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  function addAnecdote(event) {
    event.preventDefault()
    let text = event.target.text.value
    event.target.text.value = ""
    dispatch(add(text))
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
