const Anecdote = ({ anecdote }) => (
  <div>
    <div>
      <br />
      <p>
        {anecdote.content} by {anecdote.author}
        <br />
        {anecdote.info}
      </p>
    </div>
  </div>
)

export default Anecdote
