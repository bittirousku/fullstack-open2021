export interface Diagnose {
  code: string
  name: string
  latin?: string
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}
interface BaseEntry {
  id: string
  description: string
  date: string
  specialist: string
  diagnosisCodes?: Array<Diagnose["code"]>
}

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck"
  healthCheckRating: HealthCheckRating
}

interface HospitalEntry extends BaseEntry {
  type: "Hospital"
  discharge: {
    date: string
    criteria: string
  }
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare"
  employerName: string
  sickLeave?: {
    startDate: string
    endDate: string
  }
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry

export interface Patient {
  id: string
  name: string
  dateOfBirth: string
  ssn: string
  gender: string
  occupation: string
  entries: Entry[]
}

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">

export type Fields = {
  name: unknown
  dateOfBirth: unknown
  ssn: unknown
  gender: unknown
  occupation: unknown
}

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never

export type EntryFields = UnionOmit<Entry, "id">

export enum Gender {
  Male = "female",
  Female = "male",
  Other = "other",
}
