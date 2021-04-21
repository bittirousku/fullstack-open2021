const jwt = require("jsonwebtoken")

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

function tokenExtractor(request, response, next) {
  const token = getTokenFromHeaders(request)
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" })
  }
  request.token = decodedToken
  next()
}

function getTokenFromHeaders(request) {
  const authorization = request.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7)
  }
  return null
}

module.exports = {
  errorHandler,
  tokenExtractor,
}
