describe("Blog app", function () {
  let user = {
    name: "Urho k Kekkonen",
    username: "kekkone",
    password: "urkki69",
  }

  let blog = { title: "otsikko", author: "tekijä", url: "www.fi" }

  beforeEach(function () {
    // Drop the database and create new user
    // TODO: make this a cypress command
    cy.request("POST", "http://localhost:3001/api/testing/reset")
    cy.request("POST", "http://localhost:3001/api/users/", user)
  })

  // afterEach(function () {
  //   cy.request("POST", "http://localhost:3001/api/testing/reset")
  // })

  describe("When opening the main page", function () {
    beforeEach(function () {
      cy.visit("http://localhost:3000")
    })

    it("front page can be opened", function () {
      cy.contains("Blogs")
      cy.get("#username").should("be.visible")
      cy.get("#password").should("be.visible")
    })

    it("Login is possible", function () {
      cy.get("#username").type(user.username)
      cy.get("#password").type(user.password)
      cy.get("#submit").click()

      cy.get(".success").contains("Login succeeded")
      cy.contains(`Hello ${user.name}!`)
    })

    it("Login with wrong credentials is not possible", function () {
      cy.get("#username").type(user.username)
      cy.get("#password").type("salalakasnsana")
      cy.get("#submit").click()

      cy.get(".error")
        .should("contain", "Wrong credentials")
        .and("have.css", "color", "rgb(255, 0, 0)")
      cy.get("html").should("not.contain", user.name)
    })
  })

  describe("When logged in", function () {
    beforeEach(function () {
      // Logga in user
      // TODO: make this a cypress command
      cy.request("POST", "http://localhost:3001/api/login", {
        username: user.username,
        password: user.password,
      }).then((response) => {
        localStorage.setItem("loggedBlogger", JSON.stringify(response.body))
        cy.visit("http://localhost:3000")
      })
    })

    afterEach(function () {
      window.localStorage.removeItem("loggedBlogger")
    })

    it("should be able to submit new blog", function () {
      cy.contains("create new").click()
      cy.get("#title").type(blog.title)
      cy.get("#author").type(blog.author)
      cy.get("#url").type(blog.url)
      cy.contains("Save").click()

      cy.get(".success").contains("Added blog")
      cy.get("html")
        .should("contain", blog.title)
        .and("contain", blog.author)
        .and("not.contain", blog.url) // it should not yet be visible
    })

    describe("When there is one blog", function () {
      beforeEach(function () {
        // Create a new blog
        // TODO: make this a cypress command
        cy.request({
          url: "http://localhost:3001/api/blogs",
          method: "POST",
          body: blog,
          headers: {
            Authorization: `bearer ${
              JSON.parse(localStorage.getItem("loggedBlogger")).token
            }`,
          },
        })
        cy.visit("http://localhost:3000")
      })

      it("should be able to see details", function () {
        cy.get(".blogtitlebar").click()
        cy.get(".blogdetails").should("contain", blog.url)
      })

      it("should be able to give likes", function () {
        cy.get(".blogtitlebar").click()
        cy.get(".blogdetails").contains("Likes: 0")
        cy.get(".blogdetails").find(".likebutton").click()
        cy.get(".blogdetails").contains("Likes: 1")
      })

      it("should be able to delete own blog", function () {
        cy.get(".blogtitlebar").click()
        cy.get(".blogdetails").find(".deletebutton").click()
        cy.get(".blogdetails").should("not.exist")
      })

      it("should not be able to delete blog by someone else", function () {
        // TODO: make this a Cypress Command:
        function logInAnotherUser() {
          window.localStorage.removeItem("loggedBlogger")
          let user2 = {
            name: "Kerho Ukkonen",
            username: "keukkone",
            password: "gekko96",
          }
          cy.request("POST", "http://localhost:3001/api/users/", user2)

          cy.request("POST", "http://localhost:3001/api/login", {
            username: user.username,
            password: user.password,
          }).then((response) => {
            localStorage.setItem("loggedBlogger", JSON.stringify(response.body))
            cy.visit("http://localhost:3000")
          })
        }

        logInAnotherUser()
        cy.get(".blogtitlebar").click()
        cy.get(".blogdetails").find(".deletebutton").click()
        cy.get("html").should("contain", blog.title).and("contain", blog.author)
      })

      it("blogs should be ordered by the amount of likes", function () {
        // TODO
      })
    })
  })
})
