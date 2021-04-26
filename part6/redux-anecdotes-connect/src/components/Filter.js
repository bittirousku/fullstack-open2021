import React from "react"
import { connect } from "react-redux"
import { setFilter } from "../reducers/filterReducer"

const Filter = (props) => {
  const style = {
    marginBottom: 10,
  }

  return (
    <div style={style}>
      filter <input onChange={(event) => props.setFilter(event.target.value)} />
    </div>
  )
}

// NOTE: this needs to be an object!!
const mapDispatchToProps = {
  setFilter,
}

const ConnectedFilter = connect(null, mapDispatchToProps)(Filter)
export default ConnectedFilter
