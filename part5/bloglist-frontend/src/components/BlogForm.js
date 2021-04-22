import React from "react"

const BlogForm = ({
  addBlog,
  blogTitle,
  blogAuthor,
  blogUrl,
  handleBlogChange,
}) => (
  <div>
    <h2>Add new blog</h2>
    <form onSubmit={addBlog}>
      Title <input name="title" value={blogTitle} onChange={handleBlogChange} />
      <br />
      Author
      <input name="author" value={blogAuthor} onChange={handleBlogChange} />
      <br />
      Url <input name="url" value={blogUrl} onChange={handleBlogChange} />{" "}
      <br />
      <button type="submit">Save</button>
    </form>
  </div>
)

export default BlogForm
