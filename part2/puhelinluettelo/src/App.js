import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [ people, setPeople] = useState([])
  // const [ people, setPeople] = useState([
  //   { name: 'Arto Hellas', number: '040-123456' },
  //   { name: 'Ada Lovelace', number: '39-44-5323523' },
  //   { name: 'Dan Abramov', number: '12-43-234345' },
  //   { name: 'Mary Poppendieck', number: '39-23-6423122' }
  // ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterText, setFilterText ] = useState('')

  const getData = () => {
    axios
      .get('http://localhost:3001/people')
      .then(response => 
        setPeople(response.data)
      )
  }
  useEffect(getData, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (people.map(person => person.name).includes(newName)) {
      alert(`${newName} already in DB`)
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      setPeople(people.concat(newPerson))
    }
    setNewName("")
    setNewNumber("")
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const updateFilter = (event) => {
    console.log(event.target.value);
    setFilterText(event.target.value.toLowerCase())
  }

  const visiblePeople = filterText 
    ? people.filter((person) => person.name.toLowerCase().includes(filterText))
    : people

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterText} onChange={updateFilter} />
      <AddPeople
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <People people={visiblePeople} />
    </div>
  );
}


const AddPeople = (props) => {
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


const Filter = ({value, onChange}) => {
  return (
    <>
      filter shown with  <input value={value} onChange={onChange}/>
    </>
  )
}

const People = ({people}) => {
  return (
    <>
    <h3>People and their numbers</h3>
    <ul>
      {people.map(person => <Person key={person.name} person={person}/>)}
    </ul>
    </>
  )
}

const Person = ({person}) => {
  return (
    <li>{person.name} {person.number}</li>
  )
}

export default App