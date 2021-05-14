import React from "react"
import { Grid, Button } from "semantic-ui-react"
import { Field, Formik, Form } from "formik"

import { TextField, DiagnosisSelection } from "../AddPatientModal/FormField"
import { EntryFormValues, Diagnosis } from "../types"

interface Props {
  // onCancel: () => void
  onSubmit: (
    values: EntryFormValues,
    { resetForm }: { resetForm: () => void } // TODO: really I'm supposed to do it like this?
  ) => void
  diagnoses: Diagnosis[]
}

const AddEntryForm = ({ onSubmit, diagnoses }: Props) => {
  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        type: "Hospital",
        diagnosisCodes: [],
        discharge: { date: "", criteria: "" },
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required"
        const errors: { [field: string]: string } = {}
        if (!values.description) {
          errors.description = requiredError
        }
        if (!values.date) {
          errors.date = requiredError
        }
        if (!values.specialist) {
          errors.specialist = requiredError
        }
        if (!values.type) {
          errors.type = requiredError
        }

        // TODO: validate discharge and others
        return errors
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, resetForm }) => {
        return (
          <div>
            <h3>Add new entry</h3>
            <Form className="form ui">
              <Field
                label="Description"
                placeholder="Description"
                name="description"
                component={TextField}
              />
              <Field
                label="Date"
                placeholder="YYYY-MM-DD"
                name="date"
                component={TextField}
              />
              <Field
                label="specialist"
                placeholder="specialist"
                name="specialist"
                component={TextField}
              />
              {/* FIXME: these don't get reset when calling the builtin `resetForm` */}
              <DiagnosisSelection
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                diagnoses={diagnoses}
              />
              <Field
                label="Discharge date"
                placeholder="YYYY-MM-DD"
                name="discharge.date"
                component={TextField}
              />
              <Field
                label="Discharge criteria"
                placeholder="Discharge criteria"
                name="discharge.criteria"
                component={TextField}
              />
              <Grid>
                <Grid.Column floated="left" width={5}>
                  <Button type="button" onClick={() => resetForm()} color="red">
                    Cancel
                  </Button>
                </Grid.Column>
                <Grid.Column floated="right" width={5}>
                  <Button
                    type="submit"
                    floated="right"
                    color="green"
                    disabled={!dirty || !isValid}
                  >
                    Add
                  </Button>
                </Grid.Column>
              </Grid>
            </Form>
          </div>
        )
      }}
    </Formik>
  )
}

export default AddEntryForm
