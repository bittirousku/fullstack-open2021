import express from "express"
import patientService from "../services/patients"

const patientRouter = express.Router()

patientRouter.get("/", (_req, res) => {
  res.json(patientService.getEntries())
})

patientRouter.get("/:id", (req, res) => {
  const patient = patientService.findById(req.params.id)

  if (patient) {
    res.send(patient)
  } else {
    res.sendStatus(404)
  }
})

patientRouter.post('/', (req, res) => {
  res.json(patientService.addPatient( req.body ));
});


export default patientRouter
