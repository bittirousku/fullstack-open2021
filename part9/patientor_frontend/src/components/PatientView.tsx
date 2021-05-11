import React, { useState } from "react"
import { useParams } from "react-router"

import { useStateValue, State } from "../state"

import { apiBaseUrl } from "../constants"
import {
  Patient,
  Entry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
  HospitalEntry,
} from "../types"
import axios from "axios"

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

  if (!currentPatient) {
    return null // display nothing if there really was not a patient with the given ID
  }
  if (Object.keys(diagnoses).length === 0) {
    // By default it is an empty object, not `undefined`!
    return null
  }

  console.log(diagnoses)
  console.log(currentPatient)
  // console.log(Entry)
  // eslint-disable-next-line no-debugger
  // debugger
  return (
    <div>
      <h2>{currentPatient.name}</h2>
      <p>Date of birth: {currentPatient.dateOfBirth}</p>
      <p>Occupation: {currentPatient.occupation}</p>
      <h3>Entries</h3>
      {currentPatient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </div>
  )
}

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry
  diagnoses: State["diagnoses"]
}) => {
  function assertNever(value: never): never {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    )
  }

  switch (entry.type) {
    case "Hospital":
      return (
        <div>
          {" "}
          <BaseEntryPart entry={entry} diagnoses={diagnoses} />
          <HospitalEntryPart entry={entry} />
        </div>
      )
    case "HealthCheck":
      return (
        <div>
          {" "}
          <BaseEntryPart entry={entry} diagnoses={diagnoses} />
          <HealthCheckEntryPart entry={entry} />
        </div>
      )
    case "OccupationalHealthcare":
      return (
        <div>
          {" "}
          <BaseEntryPart entry={entry} diagnoses={diagnoses} />
          <OccupationalHealthcareEntryPart entry={entry} />
        </div>
      )
    default:
      assertNever(entry)
  }
}

const BaseEntryPart = ({
  entry,
  diagnoses,
}: {
  entry: Entry
  diagnoses: State["diagnoses"]
}) => {
  return (
    <div>
      {entry.date} {entry.description}
      <p>Type: {entry.type}</p>
      <ul>
        {entry.diagnosisCodes?.map((code: string) => (
          <li key={code}>
            {code} {diagnoses[code].name}
          </li>
        ))}
      </ul>
    </div>
  )
}

const HospitalEntryPart = ({ entry }: { entry: HospitalEntry }) => {
  return <div>Discharge: {entry.discharge.date}</div>
}

const HealthCheckEntryPart = ({ entry }: { entry: HealthCheckEntry }) => {
  return <div>Health check rating: {entry.healthCheckRating}</div>
}

// TODO: Why do I need to specify the exact type here? With `Entry` it gives
// Property 'employerName' does not exist on type 'Entry'.
// Property 'employerName' does not exist on type 'HospitalEntry'
const OccupationalHealthcareEntryPart = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry
}) => {
  return <div>Employer: {entry.employerName}</div>
}

export default PatientView
