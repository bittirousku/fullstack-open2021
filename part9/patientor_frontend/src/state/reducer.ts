import { State } from "./state"
import { Patient, Diagnosis, Entry } from "../types"

export type Action =
  | {
      type: "SET_PATIENT_LIST"
      payload: Patient[]
    }
  | {
      type: "ADD_PATIENT"
      payload: Patient
    }
  | {
      type: "SET_DIAGNOSIS_LIST"
      payload: Diagnosis[]
    }
  | {
      type: "ADD_ENTRY"
      payload: {
        patientId: string
        data: Entry
      }
    }

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      }
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      }
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses,
        },
      }
    case "ADD_ENTRY":
      const patient: Patient | undefined = Object.values(state.patients).find(
        (pat: Patient) => pat.id === action.payload.patientId
      )
      if (!patient) {
        return state
      }
      patient.entries = patient?.entries.concat(action.payload.data)
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.patientId]: patient,
        },
      }
    default:
      return state
  }
}

export const setPatientList = (data: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: data,
  }
}

export const addPatient = (data: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload: data,
  }
}

export const setDiagnosisList = (data: Diagnosis[]): Action => {
  return {
    type: "SET_DIAGNOSIS_LIST",
    payload: data,
  }
}

export const addPatientEntry = (patientId: string, data: Entry): Action => {
  return {
    type: "ADD_ENTRY",
    payload: {
      patientId,
      data,
    },
  }
}
