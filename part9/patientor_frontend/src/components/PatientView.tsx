import React, { useState } from "react"
import { useParams } from "react-router"

import { useStateValue } from "../state"

import { apiBaseUrl } from "../constants"
import { Patient } from "../types"
import axios from "axios"

const PatientView = () => {
  const [{ patients }, dispatch] = useStateValue()
  const [currentPatient, setCurrentPatient] = useState<Patient | undefined>()

  // Get the patient id from the url, instead of using matcher in App.tsx
  const params = useParams<{ id: string }>()

  async function getPatient(id: string) {
    try {
      const { data: currentPatient } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${id}`
      )
      dispatch({ type: "ADD_PATIENT", payload: currentPatient })
    } catch (e) {
      console.error(e.response?.data || "Unknown Error")
    }
  }
  React.useEffect(() => {
    // We'll handle the current patient via the global `patients` state
    // and update it if necessary.
    // First try to get the patient from the state
    setCurrentPatient(patients[params.id])
  }, [patients])

  React.useEffect(() => {
    if (!currentPatient) {
      // Then get the patient from backend and append to state
      // It will be updated in the previous useEffect
      void getPatient(params.id)
    }
  }, [patients])

  if (!currentPatient) {
    return null // display nothing if there really was not a patient with the given ID
  }

  return (
    <div>
      <h2>{currentPatient.name}</h2>
      <p>Date of birth: {currentPatient.dateOfBirth}</p>
      <p>Occupation: {currentPatient.occupation}</p>
      <h3>Entries</h3>
      {currentPatient.entries.map((entry) => (
        <div key={entry.id}>
          {entry.date} {entry.description}
          <ul>
            {entry.diagnosisCodes?.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default PatientView
