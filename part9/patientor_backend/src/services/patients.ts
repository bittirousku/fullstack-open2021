import { v1 as uuid } from "uuid"

import initialData from "../../data/patients.json"
import { Patient, NonSensitivePatient, Fields, Gender } from "../types"

let patientData: Patient[] = initialData

const getEntriesFullData = (): Patient[] => {
  return patientData
}

const getEntries = (): NonSensitivePatient[] => {
  return patientData.map(({ ssn, ...rest }) => rest)
}

const findById = (id: string): Patient | undefined => {
  return patientData.find((p) => p.id === id)
}

const addPatient = (data: Fields): Patient => {
  let entry = parsePatientData(data)
  patientData = patientData.concat(entry)
  return entry
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
    ssn: parseString(ssn), // TODO: validate HETU
    gender: parseGender(gender),
    occupation: parseString(occupation),
  }
}

function parseString(text: unknown): string {
  if (!text || !isString(text)) {
    throw new Error(`Incorrect or missing text ${text}`)
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
    throw new Error("Incorrect or missing weather: " + gender)
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

export default {
  getEntries,
  getEntriesFullData,
  addPatient,
  findById,
}
