const errorHandler = (error, req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    // Jest will break if there are error level logging
    console.error(error.message)
  }
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message })
  } else if (error.name === "InvalidPassword") {
    return res.status(400).send({ error: error.message })
  }
  next(error)
}

module.exports = errorHandler
