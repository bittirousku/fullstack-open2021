import axios from "axios"

// const URL = "http://localhost:3001/people"
const URL = "/api/people" // when running in Heroku

const getAll = () => {
  return axios.get(URL)
}

const getOne = (id) => {
  return axios.get(`${URL}/${id}`)
}

const create = (newPerson) => {
  return axios.post(URL, newPerson)
}

const update = (id, newPerson) => {
  return axios.put(`${URL}/${id}`, newPerson)
}

const deleteOne = (id) => {
  return axios.delete(`${URL}/${id}`)
}

const peopleService = {
  getAll,
  getOne,
  create,
  update,
  deleteOne,
}

export default peopleService
