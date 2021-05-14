export interface Diagnosis {
  code: string
  name: string
  latin?: string
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Patient {
  id: string
  name: string
  occupation: string
  gender: Gender
  ssn?: string
  dateOfBirth?: string
  entries: Entry[]
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
  diagnosisCodes?: Array<Diagnosis["code"]>
}

// Better way would be to use "human readable" text on the right hand side
// But that would require us to modify the back end code too
// and we are too lazy to do that just because of an exercise.
export enum EntryType {
  HealthCheck = "HealthCheck",
  Hospital = "Hospital",
  OccupationalHealthcare = "OccupationalHealthcare",
}
// TODO: why do I need to export these to work in PatientView entry components?
export interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheck
  healthCheckRating: HealthCheckRating
}

export interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital
  discharge: {
    date: string
    criteria: string
  }
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcare
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

export type GenderFormOption = {
  value: Gender
  label: string
}

export type DiagnosisFormOption = {
  value: string
  label: string
}

export type FormOption = GenderFormOption | DiagnosisFormOption

export type EntryFormValues = {
  description: string
  date: string
  specialist: string
  diagnosisCodes: string[]
  type: "Hospital" | "OccupationalHealthcare" | "HealthCheck"
  employerName: string
  discharge: {
    date: string
    criteria: string
  }
  sickLeave: {
    startDate: string
    endDate: string
  }
  healthCheckRating: HealthCheckRating
}

// Define special omit for unions
// type UnionOmit<T, K extends string | number | symbol> = T extends unknown
//   ? Omit<T, K>
//   : never

// FIXME: why this didn't work? I couldn't set default values for all,
// because Typescript complained about Hospital type not containing
// keys for other entry types
// export type EntryFormValues = UnionOmit<Entry, "id">
