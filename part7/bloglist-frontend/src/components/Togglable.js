import React, { useState } from "react"
import PropTypes from "prop-types"

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? "none" : "" }
  const showWhenVisible = { display: visible ? "" : "none" }

  const toggleVisibility = () => {
    console.log("visibility toggled to", !visible)
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {/* Using 'function as child' pattern to pass the function to a child*/}
        {/* https://medium.com/merrickchristensen/function-as-child-components-5f3920a9ace9 */}
        {props.children(toggleVisibility)}
        <button onClick={toggleVisibility}>
          {props.cancelButtonLabel || "cancel"}
        </button>
      </div>
    </div>
  )
}

Togglable.displayName = "Togglable"
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

export default Togglable
