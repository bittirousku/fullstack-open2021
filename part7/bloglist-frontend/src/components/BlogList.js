import React from "react"
import { useSelector } from "react-redux"

import Blog from "./Blog"

export const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.login)

  function sortByLikes(a, b) {
    return a.likes < b.likes ? 1 : a.likes > b.likes ? -1 : 0
  }

  return (
    <div>
      <h2>Blogs</h2>
      {[...blogs].sort(sortByLikes).map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} />
      ))}
    </div>
  )
}

export default BlogList
