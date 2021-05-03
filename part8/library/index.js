require("dotenv").config()
const { v1: uuid } = require("uuid")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
} = require("apollo-server")

const Author = require("./models/Author")
const Book = require("./models/Book")
const User = require("./models/User")

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET

console.log("connecting to", MONGODB_URI)

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message)
  })

// let authors = [
//   {
//     name: "Robert Martin",
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: "Martin Fowler",
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963,
//   },
//   {
//     name: "Fyodor Dostoevsky",
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821,
//   },
//   {
//     name: "Joshua Kerievsky", // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   {
//     name: "Sandi Metz", // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

let books = [
  // {
  //   title: "Clean Code",
  //   published: 2008,
  //   author: "Robert Martin",
  //   id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
  //   genres: ["refactoring"],
  // },
  // {
  //   title: "Agile software development",
  //   published: 2002,
  //   author: "Robert Martin",
  //   id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
  //   genres: ["agile", "patterns", "design"],
  // },
  // {
  //   title: "Refactoring, edition 2",
  //   published: 2018,
  //   author: "Martin Fowler",
  //   id: "afa5de00-344d-11e9-a414-719c6709cf3e",
  //   genres: ["refactoring"],
  // },
  // {
  //   title: "Refactoring to patterns",
  //   published: 2008,
  //   author: "Joshua Kerievsky",
  //   id: "afa5de01-344d-11e9-a414-719c6709cf3e",
  //   genres: ["refactoring", "patterns"],
  // },
  // {
  //   title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
  //   published: 2012,
  //   author: "Sandi Metz",
  //   id: "afa5de02-344d-11e9-a414-719c6709cf3e",
  //   genres: ["refactoring", "design"],
  // },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
]

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int
  }

  type Mutation {
    addBook(
      title: String!
      author: String
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      console.log("allBooks", args)
      let filters = {}
      if (args.author) {
        // TODO: how to make this work? There is no material in the course
        // to help with this
        filters = { "author.name": args.author }
      }
      if (args.genre) {
        filters = { ...filters, genres: { $in: [args.genre] } }
      }
      console.log("filters", filters)
      return Book.find(filters).populate("author")
    },
    allAuthors: () => {
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: (root) => {
      let authorBookCount = books.filter((b) => b.author === root.name).length
      return authorBookCount
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      if (args.title.length < 1) {
        throw new UserInputError("Too short title", { invalidArgs: args })
      }

      console.log("addBook args", args)
      let author = await Author.findOne({ name: args.author })
      console.log("author", author)
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }
      let newBook = new Book({ ...args, author: author }) // add whole author, not only author.id
      console.log("newBook", newBook)
      try {
        await newBook.save()
      } catch (err) {
        throw new UserInputError(err.message, { invalidArgs: args })
      }

      return newBook
    },
    editAuthor: async (root, args) => {
      if (!context.currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      console.log("editAuthor", args)
      let author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      return author.save()
    },

    createUser: (root, args) => {
      const user = new User({ username: args.username })

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      console.log("login", args)
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials")
      }

      // The token is created from the user object
      // The ID can be decoded later and used for finding
      // the user in the database when the user authenticates
      // with the token
      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
