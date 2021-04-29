const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)

const Blog = require("../models/blog")
const User = require("../models/user")
const helper = require("./test_helpers")

beforeEach(async () => {
  await User.deleteMany({})
})

afterEach(async () => {
  await User.deleteMany({})
})

describe("When logging in", () => {
  test("user should receive a token", async () => {
    const user = {
      name: "x y z",
      username: "yyy",
      password: "zzz",
    }
    await api.post("/api/users").send(user).expect(201)

    const loginResponse = await api
      .post("/api/login")
      .send(user)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(loginResponse.body.token).toBeDefined()
    expect(loginResponse.body.username).toBe(user.username)
  })

  test("invalid password won't give a token", async () => {
    const user = {
      name: "x y z",
      username: "yyy",
      password: "zzz",
    }
    await api.post("/api/users").send(user).expect(201)

    await api
      .post("/api/login")
      .send({ name: "x y z", username: "yyy", password: "xxx" })
      .expect(401)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
