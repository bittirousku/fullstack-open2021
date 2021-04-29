import React from "react"
import { Link } from "react-router-dom"

import { Navbar, Nav, Button } from "react-bootstrap"

export const Navigation = ({ user, handleLogout }) => {
  const padding = {
    padding: 5,
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/">
              home
            </Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/blogs">
              blogs
            </Link>
          </Nav.Link>
          {user ? (
            <>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/users">
                  users
                </Link>
              </Nav.Link>
              <Navbar.Text>{user.name} logged in</Navbar.Text>

              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/login">
                login
              </Link>
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
