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

const update = async (id, data, token) => {
  const config = { headers: { Authorization: `bearer ${token}` } }
  const url = `${baseUrl}/${id}`
  const response = await axios.patch(url, data, config)
  return response.data
}

const blogService = {
  create,
  getAll,
  update,
}

export default blogService
