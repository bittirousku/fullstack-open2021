import blogService from "../services/blogs"

const blogsReducer = (state = [], action) => {
  console.log("state now in blogsReducer: ", state)
  console.log("action in blogsReducer", action)

  switch (action.type) {
    case "INIT_BLOGS":
      return action.data
    case "ADD_BLOG":
      return state.concat(action.data)
    case "REMOVE_BLOG":
      return state.filter((blog) => blog.id !== action.data.blogId)
    case "UPDATE_BLOG":
      return state.map((blog) =>
        blog.id === action.data.updatedBlog.id ? action.data.updatedBlog : blog
      )
    default:
      return state
  }
}

export function initializeBlogs() {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: "INIT_BLOGS",
      data: blogs,
    })
  }
}

export function create(newBlog, user) {
  return async (dispatch) => {
    const created = await blogService.create(newBlog, user.token)
    // `created` has not yet been enriched with the user data.
    // It's not there even if we do a GET request with the ID. Why?
    // Have to manually add the username there for the time being
    // Should find a real solution for this though.
    created.user = { username: user.username } // dirty hack
    dispatch({
      type: "ADD_BLOG",
      data: created,
    })
  }
}

export function removeBlog(blogId, user) {
  return async (dispatch) => {
    if (window.confirm(`Do you want to delete blog  ${blogId}?`)) {
      await blogService.remove(blogId, user.token)
    }
    dispatch({
      type: "REMOVE_BLOG",
      data: { blogId },
    })
  }
}

export function likeBlog(blogId) {
  return async (dispatch) => {
    const updateData = { likes: 1 } // this doesn't really matter; backend will just increment
    const updatedBlog = await blogService.update(blogId, updateData)
    dispatch({
      type: "UPDATE_BLOG",
      data: { updatedBlog },
    })
  }
}

export function addComment(blogId, comment) {
  return async (dispatch) => {
    const updatedBlog = await blogService.comment(blogId, comment)
    dispatch({
      type: "UPDATE_BLOG",
      data: { updatedBlog },
    })
  }
}

export default blogsReducer
