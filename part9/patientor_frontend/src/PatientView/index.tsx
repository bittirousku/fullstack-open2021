import React, { useState } from "react"
import { useParams } from "react-router"
import axios from "axios"

import { useStateValue } from "../state"
import { apiBaseUrl } from "../constants"
import { Patient, EntryFormValues, Entry } from "../types"
import EntryDetails from "./EntryDetails"
import AddEntryForm from "./AddEntryForm"
import { addPatientEntry } from "../state/reducer"

const PatientView = ({
  fetchDiagnosisList,
}: {
  fetchDiagnosisList: VoidFunction
}) => {
  const [{ patients, diagnoses }, dispatch] = useStateValue()
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

  React.useEffect(() => {
    if (!diagnoses) {
      void fetchDiagnosisList()
    }
  }, [])

  async function addEntry(
    values: EntryFormValues,
    { resetForm }: { resetForm: () => void } // WOW it is ugly to type the callback function
  ) {
    if (!currentPatient) {
      throw new Error("No patient in the state")
    }
    try {
      const patientId = currentPatient.id
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patientId}/entries`,
        values
      )
      console.log(newEntry)
      dispatch(addPatientEntry(patientId, newEntry))
      resetForm()
    } catch (e) {
      console.error(e.response?.data || "Unknown Error")
      // setError(e.response?.data?.error || "Unknown error")
    }
  }

  if (!currentPatient) {
    return null // display nothing if there really was not a patient with the given ID
  }
  if (Object.keys(diagnoses).length === 0) {
    // By default it is an empty object, not `undefined`!
    return null
  }

  return (
    <div>
      <h2>{currentPatient.name}</h2>
      <p>Date of birth: {currentPatient.dateOfBirth}</p>
      <p>Occupation: {currentPatient.occupation}</p>
      <h3>Entries</h3>
      {currentPatient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
      <AddEntryForm
        onSubmit={addEntry}
        // onCancel={resetEntryForm}
        diagnoses={Object.values(diagnoses)}
      />
    </div>
  )
}
export default PatientView
