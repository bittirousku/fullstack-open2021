import React from "react"
import { connect } from "react-redux"

const Notification = (props) => {
  if (!props.notification) {
    return null
  }
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  }
  return <div style={style}> {props.notification}</div>
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
  }
}
// This is magic, I don't quite understand how the values
// are passed (where does `state` come from? How does React know that we
// want to render ConnectedNotification, not Notification?)
const ConnectedNotification = connect(mapStateToProps)(Notification)
export default ConnectedNotification
