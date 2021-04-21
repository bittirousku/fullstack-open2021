const bcrypt = require("bcrypt")
const userRouter = require("express").Router()

const User = require("../models/user")

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs")
  return response.json(users)
})

userRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id)
  return response.json(user)
})

userRouter.post("/", async (request, response) => {
  validatePassword(request.body.password)
  const user = new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash: await getPasswordHash(request.body.password),
  })
  const result = await user.save()
  return response.status(201).json(result)
})

userRouter.delete("/:id", async (request, response) => {
  await User.findByIdAndDelete(request.params.id)
  return response.status(204).end()
})

function getPasswordHash(pw) {
  const saltRounds = 10
  return bcrypt.hash(pw, saltRounds)
}

function validatePassword(pw) {
  if (!pw) {
    throw new InvalidPassword("Must provide password")
  }
  if (pw.length < 3) {
    throw new InvalidPassword("Password length must be >= 3")
  }
}

// Custom error: how to do this in a proper way?
class InvalidPassword extends Error {
  constructor(message = "", ...args) {
    super(message, ...args)
    this.name = "InvalidPassword"
    this.message = message
  }
}

module.exports = userRouter
