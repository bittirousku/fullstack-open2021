import { React, useState, useEffect } from "react"

import { ALL_AUTHORS, SET_BIRTHYEAR } from "../queries"

import { useQuery, useMutation } from "@apollo/client"

const Authors = (props) => {
  const [authors, setAuthors] = useState(null)
  const result = useQuery(ALL_AUTHORS) // Should we use this or the lazy version?

  useEffect(() => {
    if (result.data) {
      setAuthors(result.data.allAuthors)
    }
  }, [result])

  // This still feels like magic - why is it trying to render it
  // before result.data is defined? Need to put `!authors` here
  if (!props.show || !authors) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <UpdateAuthorForm authors={authors} />
    </div>
  )
}

const UpdateAuthorForm = ({ authors }) => {
  const [name, setName] = useState("")
  const [birthYear, setBirthYear] = useState("")
  // TODO: what should be the default value of a number field?

  const [setBirthyear] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  async function handleUpdate(event) {
    event.preventDefault()
    // debugger
    setBirthyear({ variables: { name, birthYear: parseInt(birthYear) } })

    setName("")
    setBirthYear("")
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleUpdate}>
        <label>
          name
          {/* <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input> */}
          <select defaultValue={name} onChange={(e) => setName(e.target.value)}>
            <option value={""} disabled>
              Select author
            </option>
            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          born
          <input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
          ></input>
        </label>
        <br />
        <button type="submit">Update author</button>
      </form>
    </div>
  )
}

export default Authors
