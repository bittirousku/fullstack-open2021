// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add("addBlog", ({ blog }) => {
  // FIXME: you can't just return values from a command :-----(
  return cy.request({
    url: "http://localhost:3001/api/blogs",
    method: "POST",
    body: blog,
    headers: {
      Authorization: `bearer ${
        JSON.parse(localStorage.getItem("loggedBlogger")).token
      }`,
    },
  })
})
