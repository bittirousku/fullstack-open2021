import anecdoteService from "../services/anecdotes"

// const anecdotesAtStart = [
//   "If it hurts, do it more often",
//   "Adding manpower to a late software project makes it later!",
//   "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
//   "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
//   "Premature optimization is the root of all evil.",
//   "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
// ]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0,
//   }
// }

// const initialState = anecdotesAtStart.map(asObject)

const anecdoteReducer = (state = [], action) => {
  console.log("state now: ", state)
  console.log("action", action)

  switch (action.type) {
    case "VOTE":
      // return state.map((anec) =>
      //   anec.id !== action.data.id ? anec : { ...anec, votes: anec.votes + 1 }
      // )
      return state.map((anec) =>
        anec.id === action.data.updatedAnecdote.id
          ? action.data.updatedAnecdote
          : anec
      )
    case "ADD":
      return [...state, action.data]
    case "INIT_ANECDOTES":
      return action.data
    default:
      return state
  }
}

export function vote(anecdote) {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.voteAnecdote(anecdote.id, {
      votes: anecdote.votes + 1,
    })
    dispatch({
      type: "VOTE",
      data: { updatedAnecdote },
    })
  }
}

export function create(content) {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: "ADD",
      data: newAnecdote,
    })
  }
}

export function initializeAnecdotes() {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: "INIT_ANECDOTES",
      data: anecdotes,
    })
  }
}

export default anecdoteReducer
