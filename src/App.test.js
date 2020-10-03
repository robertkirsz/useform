import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import App, { initialValues, validators, warningValidators, changedValues } from 'App'

// TODO: test
// Direct changes (values, errors, warnings)
// addValidationStatus
// Scroll to invalid field
// Check if values get changed in form.values as well

describe('useForm hook', () => {
  window.scrollTo = jest.fn()

  it('Works with initial values', async () => {
    const onSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 300)))

    const { getByTestId, getByLabelText, findByText } = render(
      <App initialValues={initialValues} onSubmit={onSubmit} />
    )

    const form = getByTestId('form')
    const input = getByLabelText('Input')
    const checkbox = getByLabelText('Checkbox')
    const radio1 = getByLabelText('Radio 1')
    const radio2 = getByLabelText('Radio 2')
    const select = getByTestId('select')
    const button = getByTestId('button')

    // Check if the initial form state was properly applied
    expect(input.value).toBe(initialValues.input)
    expect(checkbox.checked).toBe(initialValues.checkbox)
    expect(radio1.checked).toBe(true)
    expect(radio2.checked).toBe(false)
    expect(select.value).toBe(initialValues.select)
    expect(button.textContent).toBe('Submit')

    // Make changes in every input field
    fireEvent.change(input, { target: { value: changedValues.input } })
    fireEvent.click(checkbox)
    fireEvent.click(radio2)
    fireEvent.change(select, { target: { value: changedValues.select } })

    // Check if values got properly updated
    expect(input.value).toBe(changedValues.input)
    expect(checkbox.checked).toBe(changedValues.checkbox)
    expect(radio1.checked).toBe(false)
    expect(radio2.checked).toBe(true)
    expect(select.value).toBe(changedValues.select)

    // Submit the form
    fireEvent.submit(form)
    expect(await findByText('Submitting...')).toBeVisible()

    // Check if submitted values are as expected
    expect(onSubmit).toBeCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].input).toBe(changedValues.input)
    expect(onSubmit.mock.calls[0][0].checkbox).toBe(changedValues.checkbox)
    expect(onSubmit.mock.calls[0][0].radio).toBe(changedValues.radio)
    expect(onSubmit.mock.calls[0][0].select).toBe(changedValues.select)

    expect(await findByText('Submit')).toBeVisible()
  })

  it('Allows initial values to be reinitialized', () => {
    const { queryByLabelText, getByText } = render(<App initialValues={initialValues} />)

    expect(queryByLabelText('Input').value).toBe(initialValues.input)
    fireEvent.click(getByText('Reinitialize values'))
    expect(queryByLabelText('Input').value).toBe(changedValues.input)
  })

  it('Displays validation errors', () => {
    const { getByText, getByLabelText } = render(<App initialValues={initialValues} validators={validators} />)
    const input = getByLabelText('Input')

    fireEvent.change(input, { target: { value: '' } })
    fireEvent.blur(input)

    expect(getByText('Value is required')).toBeVisible()
  })

  it('Displays validation warnings', () => {
    const { getByText, getByLabelText } = render(
      <App initialValues={initialValues} warningValidators={warningValidators} />
    )
    const input = getByLabelText('Input')

    fireEvent.change(input, { target: { value: 'A' } })
    fireEvent.blur(input)

    expect(getByText('Value is too short')).toBeVisible()
  })

  it("Works if submit function doesn't return a Promise", () => {
    const onSubmit = jest.fn()

    const { getByTestId } = render(<App initialValues={initialValues} onSubmit={onSubmit} />)

    fireEvent.submit(getByTestId('form'))

    expect(onSubmit).toBeCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].input).toBe(initialValues.input)
    expect(onSubmit.mock.calls[0][0].checkbox).toBe(initialValues.checkbox)
    expect(onSubmit.mock.calls[0][0].radio).toBe(initialValues.radio)
    expect(onSubmit.mock.calls[0][0].select).toBe(initialValues.select)
  })

  it("Doesn't submit an invalid form", () => {
    const onSubmit = jest.fn()

    const { queryByTestId } = render(
      <App initialValues={{ ...initialValues, input: '' }} validators={validators} onSubmit={onSubmit} />
    )

    fireEvent.submit(queryByTestId('form'))
    expect(onSubmit).toBeCalledTimes(0)
  })

  it("Doesn't crash when no props are passed in", () => {
    const { queryByTestId } = render(<App />)

    fireEvent.submit(queryByTestId('form'))
    expect(queryByTestId('form')).toBeInTheDocument()
  })

  window.scrollTo.mockClear()
})
