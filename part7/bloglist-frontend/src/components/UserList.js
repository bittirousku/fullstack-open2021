import React from "react"
import { useSelector } from "react-redux"

export const UserList = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <td></td>
            <td>Blogs created</td>
          </tr>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <a href={`/users/${user.id}`}>{user.name}</a>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
