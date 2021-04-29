const _ = require("lodash")

const dummy = (blogs) => {
  blogs = 1
  return blogs
}

function totalLikes(blogs) {
  return blogs.reduce((subtotal, blog) => subtotal + blog.likes, 0)
}

function favoriteBlog(blogs) {
  if (blogs.length === 0 || !blogs) {
    return null
  }
  let likes = blogs.map((blog) => blog.likes)
  return blogs[likes.indexOf(Math.max(...likes))]
}

function mostBlogs(blogs) {
  let groupedByAuthor = _.groupBy(blogs, "author")
  let authorWithMostBlogs = _.maxBy(Object.entries(groupedByAuthor))

  return {
    author: authorWithMostBlogs[0],
    blogs: authorWithMostBlogs[1].length,
  }
}

function mostLikes(blogs) {
  let groupedByAuthor = _.groupBy(blogs, "author")
  // Function to use in the comparison
  // Note that Object.entries returns a kvpair as an array
  let iteratee = (entry) =>
    entry[1].reduce((subtotal, blog) => subtotal + blog.likes, 0)

  let authorWithMostLikes = _.maxBy(Object.entries(groupedByAuthor), iteratee)

  return {
    author: authorWithMostLikes[0],
    likes: authorWithMostLikes[1].reduce(
      (subtotal, blog) => subtotal + blog.likes,
      0
    ),
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
