import React from "react"
import { useHistory } from "react-router-dom"

import { useField } from "../hooks"

const CreateNewForm = (props) => {
  const history = useHistory()

  const content = useField("content")
  const author = useField("author")
  const info = useField("info")

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.props.value,
      author: author.props.value,
      info: info.props.value,
      votes: 0,
    })
    emptyFields()
    history.push("/")
  }

  function emptyFields() {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.props} />
        </div>
        <div>
          author
          <input {...author.props} />
        </div>
        <div>
          url for more info
          <input {...info.props} />
        </div>
        <button type="submit">create</button>
        {/* Need to set type=button, otherwise it's considered a submit button too */}
        <button name="reset" type="button" onClick={emptyFields}>
          reset
        </button>
      </form>
    </div>
  )
}

export default CreateNewForm
