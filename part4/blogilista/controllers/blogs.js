const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)

  // The same using promise chaining:
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs)
  // })
})

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  return response.json(blog)
})

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()
  return response.status(201).json(result)

  // The same using promise chaining:
  // blog.save().then((result) => {
  //   response.status(201).json(result)
  // })
})

blogsRouter.patch("/:id", async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: request.body.likes },
    { new: true }
  )
  return response.status(200).json(updatedBlog)
})

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findOneAndRemove(request.params.id)
  return response.status(204).end()
})

module.exports = blogsRouter
