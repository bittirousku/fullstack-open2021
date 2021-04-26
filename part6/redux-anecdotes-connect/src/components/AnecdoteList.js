import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { vote } from "../reducers/anecdoteReducer"
import { showNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes)
  const filter = useSelector((state) => state.filter)
  const dispatch = useDispatch()

  function sortByVotes(a, b) {
    return a.votes < b.votes ? 1 : a.votes > b.votes ? -1 : 0
  }

  function voteAnecdote(anecdote) {
    dispatch(vote(anecdote))
    dispatch(showNotification(`You just voted '${anecdote.content}'`))
  }

  const visibleAnecdotes = filter
    ? anecdotes.filter((anec) =>
        anec.content.toUpperCase().includes(filter.toUpperCase())
      )
    : anecdotes

  return (
    <div>
      {visibleAnecdotes.sort(sortByVotes).map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnecdote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
