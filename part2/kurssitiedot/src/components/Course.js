import React from 'react'

const Course = ({course}) => {
    return (
      <>
        <Header title={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </>
    )
  }

const Header = (props) => {
  return (
    <>
      <h1>{props.title}</h1>
    </>
  )

}
const Content = ({parts}) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </>
  );
}

const Part = (props) => {
  return (
    <>
      <p>
        {props.name}: {props.exercises}
      </p>
    </>
  )
}


const Total = ({parts}) => {
  const total = parts.reduce((subtotal, part) => subtotal + part.exercises, 0)
  return (
    <>
      <b>Total number of exercises {total}</b>
    </>
  )
}

export default Course