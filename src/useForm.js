import { useState, useEffect, useContext } from 'react'
import _isEqual from 'lodash.isequal'
import usePrevious from 'usePrevious'

export default function useForm({
  name = 'Form',
  initialValues = {},
  onSubmit = null,
  validators = {},
  warningValidators = {},
  addValidationStatus = false,
  scrollIntoInvalidFieldOffset = 50,
  devToolsContext = {}
}) {
  const { updateFormInDevTools, removeFormFromDevTools } = useContext(devToolsContext) || {}
  const [values, setValues] = useState(initialValues)
  const previousValues = usePrevious(initialValues)

  useEffect(() => {
    if (previousValues !== undefined && !_isEqual(previousValues, initialValues)) {
      setValues(initialValues)
    }
  })

  const [touched, setTouched] = useState(
    Object.keys(initialValues).reduce((all, key) => ({ ...all, [key]: false }), {})
  )

  const [errors, setErrors] = useState(Object.keys(validators).reduce((all, key) => ({ ...all, [key]: undefined }), {}))

  const [warnings, setWarnings] = useState(
    Object.keys(warningValidators).reduce((all, key) => ({ ...all, [key]: undefined }), {})
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitFailed, setHasSubmitFailed] = useState(false)

  // Changes value of a particular field
  const setValue = (fieldName, event, value) => {
    let newValue = ''
    // If instead of an Event object we got something alphanumeric or a boolean, let's use it
    if (['string', 'number', 'boolean'].includes(typeof event)) newValue = event
    // Some custom inputs may not store the value in `event.target` object and instead pass it as a separate variable, so we check whether it exists here
    else if (value !== undefined) newValue = value
    // If we didn't get it, let's see if it's a checkbox and get its `event.target.checked` value
    else if (event?.target?.type === 'checkbox') newValue = event.target.checked
    // If we still don't have it, try getting it from event target's `value`
    else newValue = event?.target?.value

    setValues(existingValues => ({ ...existingValues, [fieldName]: newValue }))
  }

  // Marks a particular field as touched (used to determine whether validation info should be displayed)
  const touchField = fieldName => {
    setTouched(existingValues => ({ ...existingValues, [fieldName]: true }))
  }

  // Marks all fields as touched (called just before trying to submit the form)
  const touchAllFields = (fieldNames = Object.keys(initialValues)) => {
    setTouched(fieldNames.reduce((all, key) => ({ ...all, [key]: true }), {}))
  }

  // Scroll to the top-most input that has validation error (input's DOM node must have `name` attribute)
  const scrollToInvalidField = validationResult => {
    if (typeof window === 'undefined') return

    const invalidFieldNames = Object.keys(validationResult).filter(fieldName => validationResult[fieldName])
    const domNodes = invalidFieldNames.map(fieldName => document.querySelector(`[name=${fieldName}]`))
    const nodesTopPositions = domNodes.filter(node => node).map(node => node.getBoundingClientRect().top)
    const topMostPosition = Math.min(...nodesTopPositions)
    const positionToScrollTo = window.pageYOffset + topMostPosition - scrollIntoInvalidFieldOffset

    window.scrollTo(0, positionToScrollTo)
  }

  // Runs a validator functions on a particular field
  const validateField = fieldName => {
    const value = values[fieldName]

    if (validators[fieldName]) {
      setErrors(existingErrors => ({ ...existingErrors, [fieldName]: validators[fieldName](value, values) }))
    }

    if (warningValidators[fieldName]) {
      setWarnings(existingWarnings => ({
        ...existingWarnings,
        [fieldName]: warningValidators[fieldName](value, values)
      }))
    }
  }

  // Validates all form fields at once
  const validateAllFields = (fieldNames = Object.keys(validators)) => {
    const validationResult = fieldNames.reduce(
      (all, key) => ({ ...all, [key]: validators[key]?.(values[key], values) }),
      {}
    )

    setErrors(validationResult)

    return [Object.values(validationResult).every(value => [undefined, false].includes(value)), validationResult]
  }

  // An object containing all props necessary for an input to communicate with this hook
  const inputs = Object.keys(initialValues).reduce((allInputs, currentInputName) => {
    const currentInput = {
      name: currentInputName,
      value: values[currentInputName],
      onChange: (...args) => {
        setValue(currentInputName, ...args)
      },
      onFocus: () => {
        touchField(currentInputName)
      },
      onBlur: () => {
        validateField(currentInputName)
      }
    }

    if (addValidationStatus) {
      currentInput.validationStatus =
        (touched[currentInputName] || null) &&
        ((errors[currentInputName] && 'error') || (warnings[currentInputName] && 'warning'))

      currentInput.validationMessage =
        touched[currentInputName] && (errors[currentInputName] || warnings[currentInputName])
    }

    return {
      ...allInputs,
      [currentInputName]: currentInput
    }
  }, {})

  // Allows setting the validation error remotely
  const setError = (inputName, message) => {
    setErrors(existingErrors => ({ ...existingErrors, [inputName]: message }))
    setIsSubmitting(false)
  }

  const handleSubmit = event => {
    event.preventDefault()

    if (typeof onSubmit !== 'function') return

    touchAllFields()

    const [isFormValid, validationResult] = validateAllFields()

    if (!isFormValid) {
      scrollToInvalidField(validationResult)
      setHasSubmitFailed(true)
      return
    }

    setHasSubmitFailed(false)

    setIsSubmitting(true)

    const submitResult = onSubmit(values, setError, inputs)

    if (submitResult && typeof submitResult.then) {
      submitResult.then(() => setIsSubmitting(false))
    }
  }

  // Updates DevTools when values or validation statuses change
  useEffect(() => {
    updateFormInDevTools?.({ name, values, errors, warnings })
  }, [name, values, errors, warnings])

  useEffect(
    () => () => {
      removeFormFromDevTools?.(name)
    },
    []
  )

  return {
    values,
    errors,
    warnings,
    inputs,
    setValue,
    setError,
    touchField,
    touchAllFields,
    validateField,
    validateAllFields,
    handleSubmit,
    isSubmitting,
    hasSubmitFailed
  }
}
