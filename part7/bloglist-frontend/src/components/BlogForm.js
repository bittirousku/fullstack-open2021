import React, { useState } from "react"

import { useDispatch } from "react-redux"
import { showNotification } from "../reducers/notificationReducer"
import { create } from "../reducers/blogsReducer"

const BlogForm = (props) => {
  // Form state
  const [blogTitle, setblogTitle] = useState("")
  const [blogAuthor, setblogAuthor] = useState("")
  const [blogUrl, setblogUrl] = useState("")

  const dispatch = useDispatch()

  // This makes me laugh
  // Essentially this is a Switch statement
  function handleBlogChange(event) {
    event.target.name === "author" && setblogAuthor(event.target.value)
    event.target.name === "title" && setblogTitle(event.target.value)
    event.target.name === "url" && setblogUrl(event.target.value)
  }

  async function addBlog(newBlog) {
    dispatch(create(newBlog, props.user))
    props.toggleVisibility()
    dispatch(showNotification(`You added '${newBlog.content}'`, "info"))
  }

  async function onSubmit(event) {
    event.preventDefault()
    await addBlog({ author: blogAuthor, title: blogTitle, url: blogUrl })
    setblogAuthor("")
    setblogTitle("")
    setblogUrl("")
  }

  return (
    <div>
      <h2>Add new blog</h2>
      <form onSubmit={onSubmit}>
        <label>
          Title
          <input
            id="title"
            name="title"
            value={blogTitle}
            onChange={handleBlogChange}
          />
        </label>
        <br />
        <label>
          Author
          <input
            id="author"
            name="author"
            value={blogAuthor}
            onChange={handleBlogChange}
          />
        </label>
        <br />
        <label>
          Url
          <input
            id="url"
            name="url"
            value={blogUrl}
            onChange={handleBlogChange}
          />
        </label>
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default BlogForm
