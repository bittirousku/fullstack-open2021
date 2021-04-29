import axios from "axios"
const baseUrl = "/api/blogs"

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data)
}

const getOne = (id) => {
  const url = `${baseUrl}/${id}`
  return axios.get(url).then((response) => response.data)
}
const create = async (data, token) => {
  const response = await axios.post(baseUrl, data, _getHeaderConfig(token))
  return response.data
}

const update = async (id, data) => {
  const url = `${baseUrl}/${id}`
  // const response = await axios.patch(url, data, _getHeaderConfig(token))
  const response = await axios.patch(url, data)
  return response.data
}

const remove = async (id, token) => {
  const url = `${baseUrl}/${id}`
  const response = await axios.delete(url, _getHeaderConfig(token))
  return response.data
}

const comment = async (id, data) => {
  const url = `${baseUrl}/${id}/comments`
  const response = await axios.post(url, { content: data })
  return response.data
}

const _getHeaderConfig = (token) => ({
  headers: { Authorization: `bearer ${token}` },
})

const blogService = {
  comment,
  create,
  getAll,
  getOne,
  update,
  remove,
}

export default blogService
