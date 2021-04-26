const filterReducer = (state = "", action) => {
  console.log("state now in filterReducer: ", state)
  console.log("action", action)

  switch (action.type) {
    case "SET_FILTER":
      return action.text
    default:
      return state
  }
}

export function setFilter(text) {
  console.log("Filter reducer", text)
  return {
    type: "SET_FILTER",
    text,
  }
}

export default filterReducer
