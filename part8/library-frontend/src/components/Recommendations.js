import { useLazyQuery } from "@apollo/client"
import React, { useState, useEffect } from "react"

import { ALL_BOOKS } from "../queries"

const Recommendations = (props) => {
  // filter the books with a new query
  const [books, setBooks] = useState(null)
  const [getBooks, getBooksResult] = useLazyQuery(ALL_BOOKS)

  useEffect(() => {
    if (getBooksResult.data) {
      setBooks(getBooksResult.data.allBooks)
    }
  }, [getBooksResult.data])

  useEffect(() => {
    if (props.user) {
      getBooks({ variables: { genre: props.user.favoriteGenre } })
    }
  }, [props.user, getBooks])

  if (!props.show || !books) {
    return null
  }

  return (
    <div>
      <h2>Recommendations for {props.user.username}</h2>
      <h3>Books in your favorite genre "{props.user.favoriteGenre}"</h3>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
