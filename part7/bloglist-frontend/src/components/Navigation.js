import React from "react"
import { Link } from "react-router-dom"

export const Navigation = ({ user, handleLogout }) => {
  const padding = {
    padding: 5,
  }

  return (
    <div>
      <Link style={padding} to="/">
        home
      </Link>
      <Link style={padding} to="/blogs">
        blogs
      </Link>
      {user ? (
        <>
          <Link style={padding} to="/users">
            users
          </Link>
          {user.name} logged in <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link style={padding} to="/login">
          login
        </Link>
      )}
    </div>
  )
}

export default Navigation
