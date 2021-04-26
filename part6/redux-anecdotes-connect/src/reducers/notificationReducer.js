let timeoutId

const notificationReducer = (state = "", action) => {
  console.log("state now on notificationReducer: ", state)
  console.log("action", action)

  switch (action.type) {
    case "SET_NOTIFICATION":
      state = action.text
      return state
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
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    // Is this a cool way to keep track of the timeouts?
    // Or should we have a proper state for them?
    // Seems to work though so LGTM.
    timeoutId = setTimeout(() => {
      dispatch(removeNotification())
    }, timeout)
  }
}

export default notificationReducer
