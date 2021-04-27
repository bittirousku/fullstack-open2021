import { useState, useEffect } from "react"
import axios from "axios"

export const useField = (type) => {
  const [value, setValue] = useState("")

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange,
  }
}

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (name) {
      const url = `http://restcountries.eu/rest/v2/name/${name}?fullText=true`
      axios
        .get(url)
        .then((response) => setCountry({ data: response.data[0], found: true }))
        .catch(() => setCountry({ found: false }))
    }
  }, [name])

  console.log("name from hook", name)
  console.log("country from hook", country)
  return country
}
