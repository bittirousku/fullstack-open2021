import React from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

export const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)

  function sortByLikes(a, b) {
    return a.likes < b.likes ? 1 : a.likes > b.likes ? -1 : 0
  }

  return (
    <div>
      <h2>Blogs</h2>
      {[...blogs].sort(sortByLikes).map((blog) => (
        <p key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </p>
      ))}
    </div>
  )
}

export default BlogList
