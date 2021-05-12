import { v1 as uuid } from "uuid"

import initialData from "../../data/patients"
import {
  Patient,
  NonSensitivePatient,
  Fields,
  Gender,
  Entry,
  EntryFields,
} from "../types"

let patientData: Patient[] = initialData

const getEntriesFullData = (): Patient[] => {
  return patientData
}

const getPatients = (): NonSensitivePatient[] => {
  return patientData.map(({ ssn, ...rest }) => rest)
}

const findById = (id: string): Patient | undefined => {
  return patientData.find((p) => p.id === id)
}

const addPatient = (data: Fields): Patient => {
  let patient = parsePatientData(data)
  patientData = patientData.concat(patient)
  return patient
}

function parsePatientData({
  name,
  dateOfBirth,
  ssn,
  gender,
  occupation,
}: Fields): Patient {
  return {
    id: uuid(),
    name: parseString(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseString(ssn),
    gender: parseGender(gender),
    occupation: parseString(occupation),
    entries: [],
  }
}

function parseString(text: unknown): string {
  if (!text || !isString(text)) {
    throw new Error(`Incorrect or missing field ${text}`)
  }
  return text
}

function parseDate(date: unknown): string {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date)
  }
  return date
}

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender)
  }
  return gender
}

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String
}
const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date))
}

const isGender = (gender: any): gender is Gender => {
  return Object.values(Gender).includes(gender)
}

const addEntry = (id: string, data: EntryFields): Entry => {
  let patient: Patient | undefined = findById(id)
  if (!patient) {
    throw new Error("Patient not found")
  }
  let newEntry: Entry = parseEntryData(data)
  patient.entries = patient?.entries.concat(newEntry)
  return newEntry
}

function parseEntryData(data: EntryFields): Entry {
  switch (data.type) {
    case "Hospital":
      return {
        id: uuid(),
        description: parseString(data.description),
        date: parseDate(data.date),
        specialist: parseString(data.specialist),
        type: data.type,
        discharge: parseDischarge(data.discharge),
      }
    // TODO: Parse and check other types too...
    default:
      return {
        id: uuid(),
        ...data,
      }
  }
}

function parseDischarge(discharge: { date: string; criteria: string }) {
  if (!discharge) {
    throw new Error("Discharge missing")
  }
  return {
    date: parseDate(discharge.date),
    criteria: parseString(discharge.criteria),
  }
}

export default {
  getPatients,
  getEntriesFullData,
  addPatient,
  findById,
  addEntry,
}
