const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const { tokenExtractor, userExtractor } = require("../utils/middleware")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user")
  return response.json(blogs)
})

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  return response.json(blog)
})

// Define the middlewares per route, otherwise GET requets require
// authentication too. There HAS to be a better way to do this though!!
blogsRouter.post(
  "/",
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    console.log("request body:", request.body)
    const blog = new Blog({
      ...request.body,
      user: request.user._id,
    })
    const savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    return response.status(201).json(savedBlog)
  }
)

blogsRouter.patch("/:id", async (request, response) => {
  // We should not allow setting the likes value,
  // only incrementing it.
  if (!request.body.likes) {
    return response.status(400).send("Only incrementing likes is supported.")
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  )

  return response.status(200).json(updatedBlog)
})

blogsRouter.delete(
  "/:id",
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (request.token.id !== blog.user.toString()) {
      return response.status(401).end()
    }
    await Blog.deleteOne(blog)
    return response.status(204).end()
  }
)
blogsRouter.get("/:id/comments", async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog.comments) {
    blog.comments = []
  }
  return response.status(200).json(blog.comments)
})

blogsRouter.post("/:id/comments", async (request, response) => {
  console.log("New comment received:", request.body)
  if (!request.body) {
    return response.status(401).send("Request body missing")
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog.comments) {
    blog.comments = []
  }
  let newComment = {
    content: request.body.content,
    id: blog.comments.length + 1,
  }
  blog.comments = blog.comments.concat(newComment)
  await blog.save()
  return response.status(201).json(blog)
})

module.exports = blogsRouter
