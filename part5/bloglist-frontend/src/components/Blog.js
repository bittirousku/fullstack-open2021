import React, { useState, useEffect } from "react"

const Blog = ({ blog, incrementLikes, handleDelete, user }) => {
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
        <BlogDetails
          blog={blog}
          incrementLikes={incrementLikes}
          handleDelete={handleDelete}
          user={user}
        />
      )}
    </div>
  )
}

const BlogDetails = ({ blog, incrementLikes, handleDelete, user }) => {
  const [likes, setLikes] = useState(blog.likes)
  const [visible, setVisible] = useState(false)

  const showForCurrentUser = { display: visible ? "" : "none" }

  useEffect(() => {
    if (blog.user.username === user.username) {
      setVisible(true)
    }
  }, [blog.user.username, user.username])

  async function handleLikes(event) {
    const id = event.target.dataset.blogid
    // The likes value doesn't really matter as the backend will
    // always just increment the existing value with PATCH
    // hacky solution
    const updateData = { likes: 1 }
    const updatedBlog = await incrementLikes(id, updateData)
    blog = updatedBlog
    // TODO: should we set the blog as a React state instead of blog.likes?
    setLikes(updatedBlog.likes)
  }

  return (
    <div>
      <div>Author: {blog.author}</div>
      <div>Url: {blog.url}</div>
      <div>
        Likes: {likes}
        <LikeButton id={blog.id} handleLikes={handleLikes} />
      </div>
      <div style={showForCurrentUser}>
        <button data-blogid={blog.id} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}

const LikeButton = ({ id, handleLikes }) => {
  return (
    <>
      <button data-blogid={id} onClick={handleLikes}>
        Like
      </button>
    </>
  )
}

export default Blog
