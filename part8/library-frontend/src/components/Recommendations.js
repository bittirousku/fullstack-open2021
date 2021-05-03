import React from "react"

const Recommendations = (props) => {
  if (!props.show) {
    return null
  }

  // TODO: we need
  // the current user
  // all the books
  // Do a `me` query?

  return (
    <div>
      <h2>Recommendations</h2>
    </div>
  )
}

export default Recommendations
