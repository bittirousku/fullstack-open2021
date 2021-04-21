const _ = require("lodash")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)

const Blog = require("../models/blog")
const User = require("../models/user")
const helper = require("./test_helpers")

let testUser = {}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  const user = new User({
    name: "x y z",
    username: "yyy",
    passwordHash: "zzz",
  })
  testUser = await user.save()
})

afterEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
})

describe("When GETting blogs", () => {
  test("they should be returned as JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("all blogs should be returned", async () => {
    const response = await api.get("/api/blogs")
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test("id field should be id, not _id", async () => {
    const response = await api.get("/api/blogs")
    expect(response.body[0].id).toBeDefined()
  })
})

describe("When POSTing blogs", () => {
  test("a new blog should be created", async () => {
    const newBlog = {
      title: "testing",
      user: testUser.id,
      url: "www.test",
      likes: 0,
    }

    const postResponse = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const getResponse = await api.get("/api/blogs")

    expect(_.omit(postResponse.body, "id")).toEqual(newBlog)
    expect(getResponse.body).toHaveLength(helper.initialBlogs.length + 1)
  })

  test("a new blog should have default value for likes", async () => {
    const newBlog = {
      title: "testing",
      user: testUser.id,
      url: "www.test",
    }
    const postResponse = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    expect(postResponse.body.likes).toBeDefined
    expect(postResponse.body.likes).toEqual(0)
  })

  test("HTTP 400 for a blog without title", async () => {
    const newBlog = {
      user: testUser.id,
      url: "www.fi",
    }
    await api.post("/api/blogs").send(newBlog).expect(400)
  })
  test("HTTP 400 for a blog without url", async () => {
    const newBlog = {
      user: testUser.id,
      title: "nothing",
    }
    await api.post("/api/blogs").send(newBlog).expect(400)
  })
  test("HTTP 400 for a blog without valid author id", async () => {
    const newBlog = {
      user: "ipe",
      title: "nothing",
      url: "www.fi",
    }
    await api.post("/api/blogs").send(newBlog).expect(400)
  })
})

describe("When DELeting", () => {
  test("should delete", async () => {
    const response = await api.get("/api/blogs")
    await api.delete(`/api/blogs/${response.body[0].id}`)
    const responseAgain = await api.get("/api/blogs")

    expect(response.body).toHaveLength(2)
    expect(responseAgain.body).toHaveLength(1)
  })
})

describe("When PATCHing", () => {
  test("should be able to update likes count", async () => {
    const newBlog = {
      title: "testing",
      user: testUser.id,
      url: "www.test",
    }
    const newLikeCount = 500
    const postResponse = await api.post("/api/blogs").send(newBlog).expect(201)

    const patchResponse = await api
      .patch(`/api/blogs/${postResponse.body.id}`)
      .send({ likes: newLikeCount })
      .expect(200)

    const getResponse = await api.get(`/api/blogs/${postResponse.body.id}`)

    expect(postResponse.body.likes).toBe(0)
    expect(patchResponse.body.likes).toBe(newLikeCount)
    expect(getResponse.body.likes).toBe(newLikeCount)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
