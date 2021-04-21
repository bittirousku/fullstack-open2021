const initialBlogs = [
  {
    title: "otsikko",
    user: "60800789491fbe791c7f65fa",
    url: "www.url.fi",
    likes: 5,
  },
  {
    title: "elämä ja teot",
    user: "60800789491fbe791c7f65fa",
    url: "www.fi",
    likes: 600,
  },
]

const initialUsers = [
  {
    name: "urho k kekkonen",
    username: "kekkone",
    passwordHash: "invalid",
    blogs: [],
  },
  {
    name: "aku a ankka",
    username: "aaa",
    passwordHash: "fake",
    blogs: [],
  },
]
module.exports = {
  initialBlogs,
  initialUsers,
}
