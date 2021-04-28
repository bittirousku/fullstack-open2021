const notificationReducer = (state = {}, action) => {
  console.log("state now: ", state)
  console.log("action", action)

  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.message
    default:
      return state
  }
}

export function addNotification(text, type) {
  return {
    type: "SET_NOTIFICATION",
    message: { text, type },
  }
}

export function removeNotification() {
  return {
    type: "SET_NOTIFICATION",
    message: "",
  }
}

export function showNotification(text, type = "info", timeout = 5000) {
  return async (dispatch) => {
    dispatch(addNotification(text, type))
    setTimeout(() => dispatch(removeNotification()), timeout)
  }
}

export default notificationReducer
