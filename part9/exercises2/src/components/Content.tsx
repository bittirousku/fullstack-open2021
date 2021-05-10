import React from "react"
import { CoursePart } from "../types"

import Part from "./Part"

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      {courseParts.map((course) => (
        <p key={course.name}>
          <Part course={course} />
        </p>
      ))}
    </div>
  )
}

export default Content
