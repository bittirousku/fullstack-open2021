import React, { useState, useImperativeHandle } from "react"

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? "none" : "" }
  const showWhenVisible = { display: visible ? "" : "none" }

  const toggleVisibility = () => {
    console.log("visibility toggled to", !visible)
    setVisible(!visible)
  }

  // This here exposes `toggleVisibility` to the parent level
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>
          {props.cancelButtonLabel || "cancel"}
        </button>
      </div>
    </div>
  )
}) // Note that React.forwardRef is a function call!

export default Togglable
