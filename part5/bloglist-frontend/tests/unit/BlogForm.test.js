import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent, act, waitFor } from "@testing-library/react"
import BlogForm from "../../src/components/BlogForm"

import "regenerator-runtime/runtime" // testing setting the likes requires this I think

describe("BlogForm", () => {
  let component
  let mockAddBlog

  const blog = {
    title: "otsikko",
    author: "kirjoittaja",
    url: "www.fi",
  }

  beforeEach(() => {
    mockAddBlog = jest.fn(async () => {})
    component = render(<BlogForm addBlog={mockAddBlog} />)
  })

  test("should render the form", () => {
    expect(component.container).toHaveTextContent("Author")
    expect(component.container.querySelector("#title")).toBeDefined()
    expect(component.container.querySelector("#author")).toBeDefined()
    expect(component.container.querySelector("#url")).toBeDefined()
  })

  test("should invoke callback with correct parameters", async () => {
    const title = component.container.querySelector("#title")
    const author = component.container.querySelector("#author")
    const url = component.container.querySelector("#url")
    const form = component.container.querySelector("form")

    fireEvent.change(title, {
      target: { value: blog.title },
    })
    fireEvent.change(author, {
      target: { value: blog.author },
    })
    fireEvent.change(url, {
      target: { value: blog.url },
    })
    fireEvent.submit(form)

    expect(mockAddBlog.mock.calls).toHaveLength(1)
    expect(mockAddBlog).toHaveBeenCalledWith(blog)

    // TODO: should wait for these to be true
    // No need to use `act()` - in fact it would be wrong
    // IMPORTANT to wait inside the test for the state to change!!
    await waitFor(() => {
      expect(title.value).toBe("")
      expect(author.value).toBe("")
      expect(url.value).toBe("")
    })
  })
})
