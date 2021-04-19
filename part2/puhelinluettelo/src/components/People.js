import React from "react"


export const AddPeople = (props) => {
    return (
      <>
        <h3>Add people</h3>
        <form onSubmit={props.addPerson}>
          <div>
            name: <input value={props.newName} onChange={props.handleNameChange}/>
            <br/>
            number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
      </>
    )
  }
  
  
  export const Filter = ({value, onChange}) => {
    return (
      <>
        filter shown with  <input value={value} onChange={onChange}/>
      </>
    )
  }
  
  export const People = ({people, handleDelete}) => {
    return (
      <>
      <h3>People and their numbers</h3>
      <ul>
        {people.map(person => <Person key={person.name} person={person} handleDelete={handleDelete}/>)}
      </ul>
      </>
    )
  }
  
  const Person = ({person, handleDelete}) => {
    return (
      <li>{person.name} {person.number} <DeleteButton handleDelete={(event) => handleDelete(event, person)} /></li>
    )
  }
  
  const DeleteButton = ({handleDelete, value}) => {
    return (
      <>
        <button onClick={handleDelete}>delete</button>
      </>
    )
  }

