const _ = require("lodash")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)

const Blog = require("../models/blog")
const User = require("../models/user")
const helper = require("./test_helpers")

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

// afterEach(async () => {
//   await User.deleteMany({})
// })

describe("When GETting users", () => {
  test("should see all the users", async () => {
    const response = await api.get("/api/users")
    expect(response.body).toHaveLength(helper.initialUsers.length)
  })

  test("should see users blogs", async () => {
    const response = await api.get("/api/users")

    const newBlog = {
      title: "testing",
      user: response.body[0].id,
      url: "www.test",
      likes: 0,
    }
    await api.post("/api/blogs/").send(newBlog)
    const responseAgain = await api.get(`/api/users/${response.body[0].id}`)

    expect(response.body[0].blogs.length).toBe(0)
    expect(responseAgain.body.blogs.length).toBe(1)
  })

  test("should not see password field", async () => {
    const response = await api.get("/api/users")
    expect(response.body[0].passwordHash).not.toBeDefined()
  })
})

describe("When POSTing users", () => {
  test("should create valid user", async () => {
    const payload = {
      name: "tomi",
      username: "testaaja",
      password: "qwerty",
    }
    const response = await api.post("/api/users").send(payload).expect(201)

    expect(response.body.name).toBe(payload.name)
    expect(response.body.username).toBe(payload.username)
    expect(response.body.id).toBeDefined()
    expect(response.body.passwordHash).not.toBeDefined()
  })

  test("should not create duplicate user", async () => {
    const payload = {
      name: "tomi",
      username: "testaaja",
      password: "qwerty",
    }
    await api.post("/api/users").send(payload).expect(201)
    const duplicatePostResponse = await api
      .post("/api/users")
      .send(payload)
      .expect(400)
    const response = await api.get("/api/users")

    expect(duplicatePostResponse.body.error).toContain(
      "expected `username` to be unique"
    )
    expect(response.body.length).toBe(helper.initialUsers.length + 1)
  })

  test("should not create a user with invalid username", async () => {
    const payload = {
      name: "tomi",
      username: "t",
      password: "qwerty",
    }
    const postResponse = await api.post("/api/users").send(payload).expect(400)
    const getResponse = await api.get("/api/users")

    expect(postResponse.body.error).toContain(
      "is shorter than the minimum allowed length"
    )
    expect(getResponse.body.length).toBe(helper.initialUsers.length)
  })

  test("should not create a user with invalid password", async () => {
    const payload = {
      name: "tomi",
      username: "testaaja",
      password: "q",
    }
    const postResponse = await api.post("/api/users").send(payload).expect(400)
    const getResponse = await api.get("/api/users")

    expect(postResponse.body.error).toContain("Password length must be")
    expect(getResponse.body.length).toBe(helper.initialUsers.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
