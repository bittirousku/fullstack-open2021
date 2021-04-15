import React from 'react'

const App = () => {
  const course = {
    title: "Half Stack application development",
    parts: [
      { name: "Fundamentals of React", exercises: 10 },
      { name: "Using props to pass data", exercises: 7 },
      { name: "State of a component", exercises: 14 },
    ],
  }

  return (
    <div>
      <Header title={course.title} />
      <Content data={course.parts} />
      <Total data={course.parts} />
    </div>
  )
}

const Header = (props) => {
  return (
    <>
      <h1>{props.title}</h1>
    </>
  )

}
const Content = (props) => {
  return (
    <>
      <Part part={props.data[0].name} exercises={props.data[0].exercises}/>
      <Part part={props.data[1].name} exercises={props.data[1].exercises}/>
      <Part part={props.data[2].name} exercises={props.data[2].exercises}/>
    </>
  )
}

const Part = (props) => {
  return (
    <>
      <p>
        {props.part}: {props.exercises}
      </p>
    </>
  )
}


const Total = (props) => {
  return (
    <>
      <p>Number of exercises {props.data[0].exercises + props.data[1].exercises + props.data[2].exercises}</p>
    </>
  )

}

export default App