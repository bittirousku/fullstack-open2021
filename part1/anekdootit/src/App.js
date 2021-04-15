import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const selectRandom = () => {
    let rand = Math.floor(Math.random()*anecdotes.length)
    setSelected(rand)
  }

  const vote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  const bestAnecdoteNumber = votes.indexOf(Math.max(...votes))

  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}
      <br/>
      Has {votes[selected]} votes.
      <br/>
      <Button handleClick={vote} text="Vote"/>
      <Button handleClick={selectRandom} text="Next anecdote"/>

      <h2>Anecdote with the most votes</h2>
      {anecdotes[bestAnecdoteNumber]}
      <br/>
      Has {votes[bestAnecdoteNumber]} votes.
    </div>
  )
}

const Button = ({handleClick, text}) => {
  return (
    <>
    <button onClick={handleClick}>{text}</button>
    </>
  )
}

export default App