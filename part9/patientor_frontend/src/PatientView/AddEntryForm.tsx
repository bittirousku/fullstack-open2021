import React from "react"
import {
  Grid,
  Button,
  RadioProps,
  Form as SemanticForm,
} from "semantic-ui-react"
import { Field, Formik, Form, FormikProps } from "formik"

import {
  TextField,
  // SelectField,
  DiagnosisSelection,
  NumberField,
} from "../AddPatientModal/FormField"
import {
  EntryFormValues,
  HealthCheckRating,
  Diagnosis,
  EntryType,
} from "../types"

interface Props {
  // onCancel: () => void
  onSubmit: (
    values: EntryFormValues,
    { resetForm }: { resetForm: () => void } // TODO: really I'm supposed to type the function like this?
  ) => void
  diagnoses: Diagnosis[]
}

function isIsoDate(date: string): boolean {
  return /\d{4}-\d{2}-\d{2}/.test(date)
}

const typeOptions = Object.values(EntryType).map((type) => ({
  value: type,
  label: type.replace(/([a-z])([A-Z])/g, "$1 $2"),
}))

// This looks ugly. How to properly handle errors for both nested
// and unnested fields?
type Errors =
  | { [field: string]: string }
  | { [field: string]: { [date: string]: string } } // typing for nested field errors

// TODO: make this a modal dialog like in the example.
const AddEntryForm = ({ onSubmit, diagnoses }: Props) => {
  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        type: EntryType.Hospital, // TODO: How to have empty initial value?
        diagnosisCodes: [],
        discharge: { date: "", criteria: "" },
        healthCheckRating: HealthCheckRating.Healthy,
        employerName: "",
        sickLeave: {
          startDate: "",
          endDate: "",
        },
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required"
        const dateFormatError = "Date format must be YYYY-MM-DD"
        const errors: Errors = {}
        if (!values.description) {
          errors.description = requiredError
        }
        if (!values.date) {
          errors.date = requiredError
        }
        if (values.date) {
          if (!isIsoDate(values.date)) {
            errors.date = dateFormatError
          }
        }
        if (!values.specialist) {
          errors.specialist = requiredError
        }
        if (!values.type) {
          errors.type = requiredError
        }

        if (values.type === EntryType.Hospital) {
          if (values.discharge) {
            if (!isIsoDate(values.discharge.date)) {
              errors.discharge = { date: dateFormatError }
              // TODO: Not ideal. Why the below code doesn't work?
              // if (!errors.discharge) {
              //   errors.discharge = {}
              // }
              // errors.discharge.date = dateFormatError
            }
          }
        }
        if (values.type === EntryType.HealthCheck) {
          if (!values.healthCheckRating && values.healthCheckRating !== 0) {
            errors.healthCheckRating = requiredError
          }
          // TODO: validate that the value must be between 0...3
        }

        if (values.type === EntryType.OccupationalHealthcare) {
          if (!values.employerName) {
            errors.employerName = requiredError
          }

          // Validate optional sick leave days
          // FIXME: this is awful! How to initialize the `errors.sickLeave` object?
          // Also the error appears on the form only after one has clicked on the
          // input field where the missing data should be. Horrible.
          if (values.sickLeave.startDate) {
            errors.sickLeave = {}
            if (!isIsoDate(values.sickLeave.startDate)) {
              errors.sickLeave = { startDate: dateFormatError }
            }
            if (!values.sickLeave.endDate) {
              errors.sickLeave = { ...errors.sickLeave, endDate: requiredError }
            }
          }
          if (values.sickLeave.endDate) {
            errors.sickLeave = {}
            if (!isIsoDate(values.sickLeave.endDate)) {
              errors.sickLeave = { startDate: dateFormatError }
            }
            if (!values.sickLeave.startDate) {
              errors.sickLeave = {
                ...errors.sickLeave,
                startDate: requiredError,
              }
            }
          }
        }
        console.log("errors", errors)
        return errors
      }}
    >
      {({
        values,
        isValid,
        dirty,
        setFieldValue,
        setFieldTouched,
        resetForm,
      }) => {
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
              {/* <SelectField label="Type" name="type" options={typeOptions} /> */}
              {/* Let's do it with radio buttons instead: */}
              <SelectTypeRadio
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />
              {/* FIXME: these don't get reset when calling the builtin `resetForm` */}
              <DiagnosisSelection
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                diagnoses={diagnoses}
              />
              {/* HOSPITAL */}
              {values.type === EntryType.Hospital && (
                <>
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
                </>
              )}
              {/* HEALTH CHECK */}
              {/* TODO: this gives error about changing the state from undefined to defined value... */}
              {values.type === EntryType.HealthCheck && (
                <div>
                  <Field
                    label="Health Rating"
                    min="0"
                    max="3"
                    name="healthCheckRating"
                    component={NumberField}
                  />
                </div>
              )}

              {/* OCCUPATIONAL */}
              {values.type === EntryType.OccupationalHealthcare && (
                <div>
                  <Field
                    label="Employer name"
                    placeholder="Employer name"
                    name="employerName"
                    component={TextField}
                  />
                  <Field
                    label="Sickleave start date"
                    placeholder="YYYY-MM-DD"
                    name="sickLeave.startDate"
                    component={TextField}
                  />
                  <Field
                    label="Sickleave end date"
                    placeholder="YYYY-MM-DD"
                    name="sickLeave.endDate"
                    component={TextField}
                  />
                </div>
              )}

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

export const SelectTypeRadio = ({
  setFieldValue,
  setFieldTouched,
}: {
  setFieldValue: FormikProps<{ type: string }>["setFieldValue"]
  setFieldTouched: FormikProps<{ type: string }>["setFieldTouched"]
}) => {
  const field = "type"
  const onSelect = (
    _event: React.SyntheticEvent<HTMLElement, Event>,
    data: RadioProps
  ) => {
    setFieldTouched(field, true)
    console.log("data", data)
    setFieldValue(field, data.value)
  }
  return (
    <SemanticForm.Field>
      <div role="group" aria-labelledby="my-radio-group">
        <table>
          <tbody>
            <tr>
              {typeOptions.map((typeOption) => (
                <td key={typeOption.value}>
                  <label>
                    <Field
                      type="radio"
                      name="type"
                      value={typeOption.value}
                      onSelect={onSelect}
                    />
                    {typeOption.label}
                  </label>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </SemanticForm.Field>
  )
}

export default AddEntryForm
