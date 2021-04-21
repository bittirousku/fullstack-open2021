const _ = require("lodash")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)

const Blog = require("../models/blog")
const User = require("../models/user")
const helper = require("./test_helpers")

let testUser = {
  name: "x y z",
  username: "yyy",
  password: "zzz",
  token: "",
}
// FIXME: these tests take a long time to run, investigate and fix

async function loginUser() {
  const newUserResponse = await api.post("/api/users").send(testUser)
  const loginResponse = await api.post("/api/login").send(testUser)
  testUser.token = loginResponse.body.token
  testUser.id = newUserResponse.body.id
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await loginUser()
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
      .set("authorization", `bearer ${testUser.token}`)
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
      .set("authorization", `bearer ${testUser.token}`)
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
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("authorization", `bearer ${testUser.token}`)
      .expect(400)
  })
  test("HTTP 400 for a blog without url", async () => {
    const newBlog = {
      user: testUser.id,
      title: "nothing",
    }
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("authorization", `bearer ${testUser.token}`)
      .expect(400)
  })
  test("HTTP 400 for a blog without valid token authorization", async () => {
    const newBlog = {
      user: "ipe",
      title: "nothing",
      url: "www.fi",
    }
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("authorization", "trololoo")
      .expect(401)
  })
})

describe("When DELeting", () => {
  test("should delete", async () => {
    // First create a new blog post
    const newBlog = {
      title: "testing",
      user: testUser.id,
      url: "www.test",
      likes: 0,
    }
    const postResponse = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("authorization", `bearer ${testUser.token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const getResponseBeforeDeleting = await api.get("/api/blogs")

    await api
      .delete(`/api/blogs/${postResponse.body.id}`)
      .set("authorization", `bearer ${testUser.token}`)
      .expect(204)

    const getResponseAfterDeleting = await api.get("/api/blogs")

    expect(getResponseBeforeDeleting.body.length).toBe(3)
    expect(getResponseAfterDeleting.body.length).toBe(2)
  })

  test("should not delete without authorization", async () => {
    // First create a new blog post
    const newBlog = {
      title: "testing",
      user: testUser.id,
      url: "www.test",
      likes: 0,
    }
    const postResponse = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("authorization", `bearer ${testUser.token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    await api.delete(`/api/blogs/${postResponse.body.id}`).expect(401)
  })

  test("should not delete other users blogs", async () => {
    const response = await api.get("/api/blogs")
    await api
      .delete(`/api/blogs/${response.body[0].id}`)
      .set("authorization", `bearer ${testUser.token}`)
      .expect(401)
    const responseAgain = await api.get("/api/blogs")

    expect(response.body).toHaveLength(2)
    expect(responseAgain.body).toHaveLength(2)
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
    const postResponse = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("authorization", `bearer ${testUser.token}`)
      .expect(201)

    const patchResponse = await api
      .patch(`/api/blogs/${postResponse.body.id}`)
      .send({ likes: newLikeCount })
      .set("authorization", `bearer ${testUser.token}`)
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
