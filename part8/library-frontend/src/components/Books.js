import { React, useState, useEffect } from "react"

import { ALL_BOOKS } from "../queries"

import { useQuery } from "@apollo/client"

const Books = (props) => {
  const [books, setBooks] = useState(null)
  const [genres, setGenres] = useState(null)
  const [genre, setGenre] = useState(null)
  const getBooksResult = useQuery(ALL_BOOKS)
  const [visibleBooks, setVisibleBooks] = useState(null)

  useEffect(() => {
    if (getBooksResult.data) {
      setBooks(getBooksResult.data.allBooks)
    }
  }, [getBooksResult])

  useEffect(() => {
    // This looks ugly...how to improve?
    if (books) {
      if (genre) {
        setVisibleBooks(books.filter((book) => book.genres.includes(genre)))
      } else {
        setVisibleBooks(books)
      }
    }
  }, [books, genre])

  useEffect(() => {
    if (books) {
      // Dedupe the nested array of genres
      let genres = [...new Set([].concat(...books.map((book) => book.genres)))]
      setGenres(genres)
    }
  }, [books])

  // Here was `!books` before - it resulted in the visibleBooks not being set
  // before React tried to render the component
  if (!props.show || !visibleBooks) {
    return null
  }

  function handleGenre(event) {
    setGenre(event.target.value)
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {visibleBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              {/* There was `a.author` first, which resulted in horrible errors */}
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <GenreFilter genres={genres} handleGenre={handleGenre} />
    </div>
  )
}

export const GenreFilter = ({ genres, handleGenre }) => {
  return (
    <div>
      {genres.map((genre) => (
        <button key={genre} value={genre} onClick={(e) => handleGenre(e)}>
          {genre}
        </button>
      ))}
      <br />
      <button value={null} onClick={(e) => handleGenre(e)}>
        reset filter
      </button>
    </div>
  )
}

export default Books
