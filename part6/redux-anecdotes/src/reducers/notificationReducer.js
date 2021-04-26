const notificationReducer = (state = "", action) => {
  console.log("state now: ", state)
  console.log("action", action)

  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.text
    default:
      return state
  }
}

export function addNotification(text) {
  return {
    type: "SET_NOTIFICATION",
    text,
  }
}

export function removeNotification() {
  return {
    type: "SET_NOTIFICATION",
    text: "",
  }
}

export function showNotification(text, timeout = 5000) {
  return async (dispatch) => {
    dispatch(addNotification(text))
    setTimeout(() => dispatch(removeNotification()), timeout)
  }
}

export default notificationReducer
