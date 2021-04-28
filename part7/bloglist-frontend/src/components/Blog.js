/* eslint-disable no-debugger */
import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"

const Blog = ({ blog, incrementLikes, handleDelete, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  function handleView() {
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
    <div className="blogentry" style={blogStyle}>
      <div className="blogtitlebar" onClick={handleView} style={headerStyle}>
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

  // This part was problematic, as the `blog` didn't have the populated user data
  // from MongoDB at first. This is fixed with a dirty hack in App.addBlog
  useEffect(() => {
    if (user !== null && blog.user.username === user.username) {
      setVisible(true)
    }
  }, [])

  const showForCurrentUser = { display: visible ? "" : "none" }

  // This is really ugly and hacky solution
  async function handleLikes(event) {
    const id = event.target.dataset.blogid
    // The likes value doesn't really matter as the backend will
    // always just increment the existing value with PATCH
    const updateData = { likes: 1 }
    const updatedBlog = await incrementLikes(id, updateData)
    blog = updatedBlog
    // TODO: should we set the blog as a React state instead of blog.likes?
    setLikes(updatedBlog.likes)
  }

  return (
    <div className="blogdetails">
      <div className="author">Author: {blog.author}</div>
      <div className="url">Url: {blog.url}</div>
      <div className="likes">
        Likes: {likes}
        <LikeButton id={blog.id} handleLikes={handleLikes} />
      </div>
      <div style={showForCurrentUser}>
        <button
          className="deletebutton"
          data-blogid={blog.id}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
BlogDetails.propTypes = {
  blog: PropTypes.object.isRequired,
  incrementLikes: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  user: PropTypes.object,
}

const LikeButton = ({ id, handleLikes }) => {
  return (
    <>
      <button className="likebutton" data-blogid={id} onClick={handleLikes}>
        Like
      </button>
    </>
  )
}

export default Blog
