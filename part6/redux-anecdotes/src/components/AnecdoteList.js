import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { vote } from "../reducers/anecdoteReducer"
import {
  addNotification,
  removeNotification,
} from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes)
  const filter = useSelector((state) => state.filter)
  const dispatch = useDispatch()

  // How to remove the duplication of this function?
  function showNotification(text) {
    dispatch(addNotification(text))
    setTimeout(() => dispatch(removeNotification()), 5000)
  }

  function sortByVotes(a, b) {
    return a.votes < b.votes ? 1 : a.votes > b.votes ? -1 : 0
  }

  function voteAnecdote(anecdote) {
    showNotification(`You just voted '${anecdote.content}'`)
    dispatch(vote(anecdote.id))
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
