import { useState } from 'react'
import PropTypes from 'prop-types'
import useForm from 'useForm'

export const SUBMIT = 'Submit'
export const SUBMITTING = 'Submitting...'
const emptyFunction = () => {}

export const initialValues = {
  input: 'Initial input value',
  checkbox: false,
  radio: 'radio1',
  select: 'option1'
}

export const changedValues = {
  input: 'Changed input value',
  checkbox: true,
  radio: 'radio2',
  select: 'option2'
}

const propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  validators: PropTypes.object
}

function Form({ initialValues, onSubmit, validators }) {
  const form = useForm({ initialValues, onSubmit, validators, addValidationStatus: false })

  return (
    <>
      <form data-testid="form" onSubmit={form.handleSubmit}>
        <div>
          <label htmlFor="input">Input</label>
          <input id="input" {...form.inputs.input} />
        </div>

        <div>
          <input type="checkbox" id="checkbox" {...form.inputs.checkbox} />
          <label htmlFor="checkbox">Checkbox</label>
        </div>

        <div>
          <input
            type="radio"
            id="radio1"
            value="radio1"
            checked={form.inputs.radio?.value === 'radio1'}
            onChange={form.inputs.radio?.onChange || emptyFunction}
          />
          <label htmlFor="radio1">Radio 1</label>

          <input
            type="radio"
            id="radio2"
            value="radio2"
            checked={form.inputs.radio?.value === 'radio2'}
            onChange={form.inputs.radio?.onChange || emptyFunction}
          />
          <label htmlFor="radio2">Radio 2</label>
        </div>

        <select data-testid="select" {...form.inputs.select}>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>

        <button data-testid="button" type="submit">
          {form.isSubmitting ? SUBMITTING : SUBMIT}
        </button>
      </form>

      <pre>{JSON.stringify(form.values, null, 2)}</pre>
    </>
  )
}

Form.propTypes = propTypes

export default function App({ initialValues, onSubmit, validators }) {
  const [internalValues, setInternalValues] = useState(initialValues)

  function reinitializeValues() {
    setInternalValues(changedValues)
  }

  return (
    <div id="app">
      <Form initialValues={internalValues} onSubmit={onSubmit} validators={validators} />
      <button onClick={reinitializeValues}>Reinitialize values</button>
    </div>
  )
}

App.propTypes = propTypes
