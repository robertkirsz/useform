import { useState } from 'react'
import PropTypes from 'prop-types'
import Div from 'styled-kit/Div'
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

export const validators = {
  input: value => (value === '' ? 'Value is required' : undefined)
}

export const warningValidators = {
  input: value => (value.length < 2 ? 'Value is too short' : undefined)
}

const propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  validators: PropTypes.object,
  warningValidators: PropTypes.object,
  statePreview: PropTypes.func
}

const defaultProps = {
  statePreview: emptyFunction
}

function Form({ initialValues, onSubmit, validators, warningValidators, statePreview }) {
  const form = useForm({ initialValues, onSubmit, validators, warningValidators, addValidationStatus: false })

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

        {form.errors.input && <p className="error">{form.errors.input}</p>}
        {form.warnings.input && <p className="warning">{form.warnings.input}</p>}
      </form>

      {statePreview(form)}
    </>
  )
}

Form.propTypes = propTypes
Form.defaultProps = defaultProps

export default function App({ initialValues, onSubmit, validators, warningValidators }) {
  const [internalValues, setInternalValues] = useState(initialValues)

  function reinitializeValues() {
    setInternalValues(changedValues)
  }

  return (
    <div id="app">
      <Form
        initialValues={internalValues}
        onSubmit={onSubmit}
        validators={validators}
        warningValidators={warningValidators}
        statePreview={form => (
          <Div columnTop border="1px solid">
            <pre>Values: {JSON.stringify(form.values, null, 2)}</pre>
            <pre>Errors: {JSON.stringify(form.errors, null, 2)}</pre>
            <pre>Warnings: {JSON.stringify(form.warnings, null, 2)}</pre>
          </Div>
        )}
      />
      <button onClick={reinitializeValues}>Reinitialize values</button>
    </div>
  )
}

App.propTypes = propTypes
