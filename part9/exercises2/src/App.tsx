import React from "react"

import { courseName, courseParts } from "./data"
import Header from "./components/Header"
import Content from "./components/Content"
import Total from "./components/Total"

const App = () => {
  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />

      <Total courseParts={courseParts} />
    </div>
  )
}

export default App
