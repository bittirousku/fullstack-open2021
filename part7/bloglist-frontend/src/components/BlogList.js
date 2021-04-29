import React from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import Table from "react-bootstrap/Table"

export const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)

  function sortByLikes(a, b) {
    return a.likes < b.likes ? 1 : a.likes > b.likes ? -1 : 0
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Table striped>
        <tbody>
          {[...blogs].sort(sortByLikes).map((blog) => (
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>
                  {blog.title} by {blog.author}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default BlogList
