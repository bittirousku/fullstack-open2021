import React from "react"
import axios from "axios"
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { Button, Divider, Header, Container } from "semantic-ui-react"

import { apiBaseUrl } from "./constants"
import { useStateValue } from "./state"
import { Patient, Diagnosis } from "./types"

import PatientListPage from "./PatientListPage"
import PatientView from "./PatientView"

import { setPatientList, setDiagnosisList } from "./state/reducer"

const App = () => {
  const [, dispatch] = useStateValue()
  async function fetchPatientList() {
    try {
      const { data: patientListFromApi } = await axios.get<Patient[]>(
        `${apiBaseUrl}/patients`
      )
      dispatch(setPatientList(patientListFromApi))
    } catch (e) {
      console.error(e)
    }
  }
  async function fetchDiagnosisList() {
    try {
      const { data: diagnosisListFromApi } = await axios.get<Diagnosis[]>(
        `${apiBaseUrl}/diagnoses`
      )
      dispatch(setDiagnosisList(diagnosisListFromApi))
    } catch (e) {
      console.error(e)
    }
  }

  React.useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`)
    void fetchPatientList()
  }, [])

  React.useEffect(() => {
    void fetchDiagnosisList()
  }, [])

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patientor</Header>
          <Button as={Link} to="/" primary>
            Home
          </Button>
          <Divider hidden />
          <Switch>
            <Route path="/patients/:id">
              <PatientView fetchDiagnosisList={fetchDiagnosisList} />
            </Route>
            <Route path="/">
              <PatientListPage />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  )
}

export default App
