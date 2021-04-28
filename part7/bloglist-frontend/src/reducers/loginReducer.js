import loginService from "../services/login"

const loginReducer = (state = {}, action) => {
  console.log("state now: ", state)
  console.log("action", action)

  switch (action.type) {
    case "SET_USER": {
      return action.data.user
    }
    default:
      return state
  }
}

export function loginByCredentials(username, password) {
  return async (dispatch) => {
    const user = await loginService.login({ username, password })
    // Should the localStorage manipulation be done here or in the switch block?
    window.localStorage.setItem("loggedBlogger", JSON.stringify(user))
    dispatch({
      type: "SET_USER",
      data: { user },
    })
  }
}

export function loginByExistingToken() {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogger")
    const user = loggedUserJSON ? JSON.parse(loggedUserJSON) : null
    dispatch({
      type: "SET_USER",
      data: { user },
    })
  }
}

export function logout() {
  return async (dispatch) => {
    window.localStorage.removeItem("loggedBlogger")
    dispatch({
      type: "SET_USER",
      data: { user: null },
    })
  }
}

export default loginReducer
