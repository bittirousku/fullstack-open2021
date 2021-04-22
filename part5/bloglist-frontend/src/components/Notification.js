import React from "react"

const Notification = ({ message }) => {
  if (Object.keys(message).length === 0) {
    return null
  }
  console.log("notification message", message)
  return <div className={message.type}>{message.text}</div>
}

export default Notification
