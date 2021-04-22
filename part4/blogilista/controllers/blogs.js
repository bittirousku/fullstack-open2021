const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const { tokenExtractor, userExtractor } = require("../utils/middleware")

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

blogsRouter.patch(
  "/:id",
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    // We should not allow setting the likes value,
    // only incrementing it.
    // const updatedBlog = await Blog.findByIdAndUpdate(
    //   request.params.id,
    //   { likes: request.body.likes },
    //   { new: true }
    // )
    if (!request.body.likes) {
      return response.status(400).send("Only incrementing likes is supported.")
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    )

    return response.status(200).json(updatedBlog)
  }
)

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

module.exports = blogsRouter
