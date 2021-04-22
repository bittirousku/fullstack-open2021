import axios from "axios"
const baseUrl = "/api/blogs"

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data)
}

const create = async (data, token) => {
  console.log("header", `bearer ${token}`)
  const config = { headers: { Authorization: `bearer ${token}` } }
  const response = await axios.post(baseUrl, data, config)
  return response.data
}

const blogService = {
  create,
  getAll,
}

export default blogService
