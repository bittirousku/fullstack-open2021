import React from "react"

export const Notification = ({message}) => {
    if (message === null) {
      return null
    }
    console.log(message);
    return (
      <div className={message.type} >
        {message.text}
      </div>
    )
  }