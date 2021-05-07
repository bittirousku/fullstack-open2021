import diagnoseData from "../../data/diagnoses.json"

import { Diagnose } from '../types'


const getEntries = ():  Diagnose[] => {
  return diagnoseData
}

const addEntry = () => {
  return null
}

export default {
  getEntries,
  addEntry,
}
