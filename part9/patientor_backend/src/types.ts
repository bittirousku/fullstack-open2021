export interface Diagnose {
  code: string
  name: string
  latin?: string
}

export interface Patient {
  id: string
  name: string
  dateOfBirth: string
  ssn: string
  gender: string
  occupation: string
}

export type NonSensitivePatient = Omit<Patient, "ssn">

export type Fields = {
  name: unknown
  dateOfBirth: unknown
  ssn: unknown
  gender: unknown
  occupation: unknown
}

export enum Gender {
  Male = "female",
  Female = "male",
  Other = "other"

}