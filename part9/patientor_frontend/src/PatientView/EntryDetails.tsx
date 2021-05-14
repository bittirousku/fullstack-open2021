import React from "react"

import { State } from "../state"

import {
  Entry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
  HospitalEntry,
} from "../types"

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

export default EntryDetails
