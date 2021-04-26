import axios from "axios"

const baseUrl = "http://localhost:3001/anecdotes"

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const voteAnecdote = async (id, newVotes) => {
  const response = await axios.patch(`${baseUrl}/${id}`, newVotes)
  return response.data
}

const anecdoteService = {
  createNew,
  getAll,
  voteAnecdote,
}

export default anecdoteService
