import React, { useState } from "react"

const Blog = ({ blog, incrementLikes }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  function handleView(event) {
    console.log("visibility toggled to", !detailsVisible)
    setDetailsVisible(!detailsVisible)
  }

  const blogStyle = {
    border: "solid",
    borderWidth: 0.2,
    marginTop: 10,
    marginBottom: 5,
    maxWidth: "20%",
  }

  const headerStyle = {
    backgroundColor: "lightgrey",
  }

  return (
    <div style={blogStyle}>
      <div onClick={handleView} style={headerStyle}>
        {blog.title} by {blog.author}
      </div>
      {detailsVisible && (
        <BlogDetails blog={blog} incrementLikes={incrementLikes} />
      )}
    </div>
  )
}

const BlogDetails = ({ blog, incrementLikes }) => {
  const [likes, setLikes] = useState(blog.likes)

  async function handleLikes(event) {
    const id = event.target.id
    // The likes value doesn't really matter as the backend will
    // always just increment the existing value with PATCH
    const updateData = { likes: 1 }
    const updatedBlog = await incrementLikes(id, updateData)
    setLikes(updatedBlog.likes)
  }

  return (
    <div>
      <div>Author: {blog.author}</div>
      <div>Url: {blog.url}</div>
      <div>
        Likes: {likes} <LikeButton id={blog.id} handleLikes={handleLikes} />
      </div>
    </div>
  )
}

const LikeButton = ({ id, handleLikes }) => {
  return (
    <>
      <button id={id} onClick={handleLikes}>
        Like
      </button>
    </>
  )
}

export default Blog
