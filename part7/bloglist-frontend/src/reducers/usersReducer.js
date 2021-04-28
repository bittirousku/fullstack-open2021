import usersService from "../services/users"

const usersReducer = (state = [], action) => {
  console.log("state now in usersReducer: ", state)
  console.log("action in usersReducer", action)

  switch (action.type) {
    case "INIT_USERS":
      return action.data

    default:
      return state
  }
}

export function initializeUsers() {
  return async (dispatch) => {
    const users = await usersService.getAll()
    dispatch({
      type: "INIT_USERS",
      data: users,
    })
  }
}

export default usersReducer
