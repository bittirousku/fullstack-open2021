import blogService from "../services/blogs"

const blogsReducer = (state = [], action) => {
  console.log("state now in blogsReducer: ", state)
  console.log("action in blogsReducer", action)

  switch (action.type) {
    case "INIT_BLOGS":
      return action.data
    case "ADD_BLOG":
      return state.concat(action.data)
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

export default blogsReducer
