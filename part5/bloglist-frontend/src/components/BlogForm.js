import React, { useState } from "react"

const BlogForm = ({ addBlog }) => {
  // Form state, would be better as an object:
  const [blogTitle, setblogTitle] = useState("")
  const [blogAuthor, setblogAuthor] = useState("")
  const [blogUrl, setblogUrl] = useState("")

  // This makes me laugh
  // Essentially this is a Switch statement
  function handleBlogChange(event) {
    event.target.name === "author" && setblogAuthor(event.target.value)
    event.target.name === "title" && setblogTitle(event.target.value)
    event.target.name === "url" && setblogUrl(event.target.value)
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
          <input name="title" value={blogTitle} onChange={handleBlogChange} />
        </label>
        <br />
        <label>
          Author
          <input name="author" value={blogAuthor} onChange={handleBlogChange} />
        </label>
        <br />
        <label>
          Url <input name="url" value={blogUrl} onChange={handleBlogChange} />{" "}
        </label>
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default BlogForm
