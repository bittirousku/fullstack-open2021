import axios from "axios"
const baseUrl = "/api/blogs"

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data)
}

const create = async (data, token) => {
  const response = await axios.post(baseUrl, data, _getHeaderConfig(token))
  return response.data
}

const update = async (id, data, token) => {
  const url = `${baseUrl}/${id}`
  const response = await axios.patch(url, data, _getHeaderConfig(token))
  return response.data
}

const remove = async (id, token) => {
  const url = `${baseUrl}/${id}`
  const response = await axios.delete(url, _getHeaderConfig(token))
  return response.data
}

const _getHeaderConfig = (token) => ({
  headers: { Authorization: `bearer ${token}` },
})

const blogService = {
  create,
  getAll,
  update,
  remove,
}

export default blogService
