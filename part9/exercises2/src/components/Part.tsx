import React from "react"
import { CoursePart } from "../types"

function assertNever(value: never): never {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  )
}

function renderCourseByType(course: CoursePart): JSX.Element {
  switch (course.type) {
    case "normal":
      return (
        <div>
          <h3>
            {course.name} {course.exerciseCount}
          </h3>
          <i>{course.description}</i>
        </div>
      )

    case "groupProject":
      return (
        <div>
          <h3>
            {course.name} {course.exerciseCount}
          </h3>
        </div>
      )
    case "submission":
      return (
        <div>
          <h3>
            {course.name} {course.exerciseCount}
          </h3>
          <i>{course.description}</i>
          <p>Submit to {course.exerciseSubmissionLink}</p>
        </div>
      )

    case "special":
      return (
        <div>
          <h3>
            {course.name} {course.exerciseCount}
          </h3>
          <i>{course.description}</i>
          <p>Required skills: {course.requirements.join(", ")}</p>
        </div>
      )
    default:
      return assertNever(course)
  }
}

const Part = ({ course }: { course: CoursePart }) => {
  return renderCourseByType(course)
}

export default Part
