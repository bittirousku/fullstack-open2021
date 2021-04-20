import React, { useState, useEffect } from "react"
import peopleService from "./services/people"
import { Notification } from "./components/Notification"
import { AddPeople, Filter, People } from "./components/People"

const App = () => {
  const [people, setPeople] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filterText, setFilterText] = useState("")
  const [message, setMessage] = useState({})

  useEffect(() => {
    peopleService.getAll().then((response) => setPeople(response.data))
  }, [])

  function addPerson(event) {
    event.preventDefault()
    let personExists = people.map((person) => person.name).includes(newName)
    if (personExists) {
      let shouldUpdate = window.confirm(
        `${newName} already in DB, do you want to update the phone number?`
      )
      if (shouldUpdate) {
        updatePerson()
      }
    } else {
      createPerson()
    }
    setNewName("")
    setNewNumber("")
  }

  function updatePerson() {
    setPeople(
      people.map((person) =>
        person.name === newName ? { ...person, number: newNumber } : person
      )
    )
    // Why is the personToUpdate still the old one???
    // It was just updated in the above line!
    // OK, setPeople is asynchronous and the result is not set immediately,
    // so the people variable still holds the old people list
    console.log("All people", people)
    let personToUpdate = people.find((person) => person.name === newName)
    console.log("Person to update", personToUpdate)
    peopleService
      .update(personToUpdate.id, {
        ...personToUpdate,
        number: newNumber,
      })
      .then((response) => console.log(response.data))
      .then(() =>
        notificator(`Successfully updated ${personToUpdate.name}`, "success")
      )
  }

  function createPerson() {
    const newPerson = {
      name: newName,
      number: newNumber,
    }
    peopleService
      .create(newPerson)
      .then((response) => {
        console.log(`Adding person ${JSON.stringify(response.data)}`)
        setPeople(people.concat(response.data))
      })
      .then(() =>
        notificator(`Successfully added ${newPerson.name}`, "success")
      )
      .catch((err) => {
        console.log(err)
        notificator(err.response.data.error, "error")
      })
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterUpdate = (event) => {
    console.log(event.target.value)
    setFilterText(event.target.value.toLowerCase())
  }

  const handleDelete = (event, personToDelete) => {
    // Is it useful/necessary to pass the event object here?
    console.log(`Deleting now: ${JSON.stringify(personToDelete)}`)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      peopleService
        .deleteOne(personToDelete.id)
        .then(
          setPeople(people.filter((person) => person.id !== personToDelete.id))
        )
        .then(() =>
          notificator(`Successfully deleted ${personToDelete.name}`, "success")
        )
        .catch((err) => {
          console.log(err)
          notificator(
            `Failed to delete ${personToDelete.name}, it was probably deleted from the server`,
            "error"
          )
        })
    }
  }

  // Set the message back to null after 5s
  const notificator = (message, type) => {
    let msg = { text: message, type: type }
    setMessage(msg)
    setTimeout(() => setMessage(null), 5000)
  }

  const visiblePeople = filterText
    ? people.filter((person) => person.name.toLowerCase().includes(filterText))
    : people

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} />
      <Filter value={filterText} onChange={handleFilterUpdate} />
      <AddPeople
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <People people={visiblePeople} handleDelete={handleDelete} />
    </div>
  )
}

export default App
