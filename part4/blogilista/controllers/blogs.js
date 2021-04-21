const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user")
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
  const user = await User.findById(request.token.id)

  const blog = new Blog({
    ...request.body,
    user: user._id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  return response.status(201).json(savedBlog)
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
