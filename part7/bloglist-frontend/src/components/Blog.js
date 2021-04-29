/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"

import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"

import { removeBlog, likeBlog } from "../reducers/blogsReducer"

const Blog = ({ blog, user }) => {
  // IMPORTANT!
  // When refreshing or going via direct link
  // the blogs state is not yet populated from the server
  // This prevents errors from showing
  if (!blog) {
    return null
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

  console.log(blog)
  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      {user && <BlogDetails blog={blog} user={user} />}
    </div>
  )
}

const BlogDetails = ({ blog, user }) => {
  const [visible, setVisible] = useState(false)

  const dispatch = useDispatch()
  const history = useHistory()

  // This part was problematic, as the `blog` didn't have the populated user data
  // from MongoDB at first. This is fixed with a dirty hack in blogsReducer.create
  useEffect(() => {
    function setVisibleForLoggedInUsers(blog, user) {
      if (user !== null && blog.user.username === user.username) {
        setVisible(true)
      }
    }
    setVisibleForLoggedInUsers(blog, user)
  }, [])

  const showForCurrentUser = { display: visible ? "" : "none" }

  function handleRemove(event) {
    const id = event.target.dataset.blogid
    dispatch(removeBlog(id, user))
    history.push("/blogs")
  }

  function handleLikes(event) {
    const id = event.target.dataset.blogid
    dispatch(likeBlog(id))
  }

  return (
    <div className="blogdetails">
      <div className="author">Author: {blog.author}</div>
      <div className="url">
        Url: <a href={blog.url}>{blog.url}</a>
      </div>
      <div className="likes">
        Likes: {blog.likes}
        <LikeButton id={blog.id} handleLikes={handleLikes} />
      </div>
      <div>Added by {blog.user.username}</div>
      <div style={showForCurrentUser}>
        <button
          className="deletebutton"
          data-blogid={blog.id}
          onClick={handleRemove}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
BlogDetails.propTypes = {
  blog: PropTypes.object.isRequired,
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
