import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { vote } from "../reducers/anecdoteReducer"

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state)
  const dispatch = useDispatch()

  function sortByVotes(a, b) {
    return a.votes < b.votes ? 1 : a.votes > b.votes ? -1 : 0
  }

  return (
    <div>
      {anecdotes.sort(sortByVotes).map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
