import React from 'react'


const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Kake"/>
      <Hello name="Ipe"/>      
    </div>
  )
}

const Hello = (props) => {
  return (
    <div>
      <p>Heii {props.name}... jätä jämät!</p>
    </div>
  )
}

export default App