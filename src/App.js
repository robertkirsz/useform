import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Div from 'styled-kit/Div'
import useForm from 'useForm'

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

function Form({ initialValues, onSubmit, validators, warningValidators, statePreview, children }) {
  const form = useForm({ initialValues, onSubmit, validators, warningValidators, addValidationStatus: false })

  return (
    <Div columnTop itemsCenter>
      <Div
        as="form"
        columnTop
        radius={4}
        padding={8}
        border="1px solid"
        data-testid="form"
        onSubmit={form.handleSubmit}
      >
        <Div listLeft itemsCenter>
          <label htmlFor="input">Input</label>
          <input id="input" {...form.inputs.input} />
        </Div>

        <Div listLeft itemsCenter>
          <input type="checkbox" id="checkbox" {...form.inputs.checkbox} />
          <label htmlFor="checkbox">Checkbox</label>
        </Div>

        <Div listLeft itemsCenter>
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
        </Div>

        <select data-testid="select" {...form.inputs.select}>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>

        <button data-testid="button" type="submit">
          {form.isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        {form.errors.input && <p className="error">{form.errors.input}</p>}
        {form.warnings.input && <p className="warning">{form.warnings.input}</p>}
      </Div>

      {statePreview(form)}
      {children}
    </Div>
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
    <Form
      initialValues={internalValues}
      onSubmit={onSubmit}
      validators={validators}
      warningValidators={warningValidators}
      statePreview={form => (
        <Div columnTop radius={4} padding={8} border="1px solid">
          <pre>
            {JSON.stringify({ form: { values: form.values, errors: form.errors, warnings: form.warnings } }, null, 2)}
          </pre>
        </Div>
      )}
    >
      <button onClick={reinitializeValues}>Reinitialize values</button>
    </Form>
  )
}

App.propTypes = propTypes
