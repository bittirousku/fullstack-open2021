import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent, act, waitFor } from "@testing-library/react"
import Blog from "../../src/components/Blog"

import "regenerator-runtime/runtime" // testing setting the likes requires this I think

describe("Blog component", () => {
  let component
  let blog
  let user
  let mockLikeHandler

  beforeEach(() => {
    blog = {
      id: "123",
      title: "otsikko",
      author: "kirjoittaja",
      url: "www.fi",
      likes: 0,
      user: { username: "kekkone" },
    }
    user = {
      username: "kekkone",
    }
    mockLikeHandler = jest.fn(async () => {
      return { ...blog, likes: blog.likes + 1 }
    })
    component = render(
      <Blog
        key={blog.id}
        blog={blog}
        incrementLikes={mockLikeHandler}
        handleDelete={jest.fn()}
        user={user}
      />
    )
  })

  afterEach(() => {
    mockLikeHandler = null
  })

  test("should render title and author", () => {
    expect(component.container).toHaveTextContent(
      `${blog.title} by ${blog.author}`
    )
  })

  test("should not render details component by default", () => {
    expect(component.container.querySelector(".blogdetails")).toBeNull()
  })

  test("should not render url nor likes by default", () => {
    expect(component.container).not.toHaveTextContent(blog.url)
    expect(component.container).not.toHaveTextContent(blog.likes)
  })

  test("should render details when header clicked", () => {
    const header = component.container.querySelector(".blogtitlebar")
    fireEvent.click(header)

    expect(component.container.querySelector(".blogdetails")).toBeDefined()
    expect(component.container).toHaveTextContent(blog.url)
    expect(component.container).toHaveTextContent(blog.likes)
    // component.debug()
  })

  test("should invoke incrementLikes when clicked", async () => {
    function showDetails() {
      const header = component.container.querySelector(".blogtitlebar")
      fireEvent.click(header)
    }

    showDetails()
    const likeButton = component.container.querySelector(".likebutton")

    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    // TODO: how to check that the likes are incremented by 2?
    // NOTE: important to wait for the state to return to original
    // I'm no exactly sure why they are reverted back to 0, though
    await waitFor(() => {
      expect(component.container.querySelector(".likes")).toHaveTextContent(
        "Likes: 0"
      )
    })

    // TODO: refactor code somehow so we can test that the likes are
    // incremented by 2.
    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})
