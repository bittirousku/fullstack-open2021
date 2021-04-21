const express = require("express")
require("express-async-errors") // wraps routes in try-catch blocks, import order is important!
const cors = require("cors")
const mongoose = require("mongoose")
const config = require("./utils/config")
const blogRouter = require("./controllers/blogs")

const errorHandler = require("./utils/middleware")

const app = express()

console.log("connecting to", config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

app.use(cors())
app.use(express.json())

app.use("/api/blogs", blogRouter)

app.use(errorHandler)

module.exports = app
