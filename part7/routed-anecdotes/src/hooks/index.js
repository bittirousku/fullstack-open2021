import { useState } from "react"

export const useField = (name) => {
  const [value, setValue] = useState("")

  const onChange = (event) => {
    setValue(event.target.value)
  }

  // This creates an error when passing the hook properties as
  // props with spread syntax
  const reset = () => {
    setValue("")
  }

  return {
    props: {
      name,
      value,
      onChange,
    },
    reset,
  }
}
