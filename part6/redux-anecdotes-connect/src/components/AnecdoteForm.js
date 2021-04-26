import React from "react"
import { connect } from "react-redux"
import { create } from "../reducers/anecdoteReducer"
import { showNotification } from "../reducers/notificationReducer"

const AnecdoteForm = (props) => {
  async function addAnecdote(event) {
    event.preventDefault()
    let text = event.target.text.value
    event.target.text.value = ""

    props.create(text)
    props.showNotification(`You added '${text}'`)
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

const mapDispatchToProps = {
  create,
  showNotification,
}

const ConnectedAnecdoteForm = connect(null, mapDispatchToProps)(AnecdoteForm)
export default ConnectedAnecdoteForm
