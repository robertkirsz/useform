import React from 'react'
import { render } from 'react-dom'
import App, { initialValues, validators, warningValidators } from 'App'
import { GlobalStyle } from 'styles'

const submit = values =>
  new Promise(resolve =>
    setTimeout(() => {
      console.log(values)
      resolve()
    }, 300)
  )

render(
  <>
    <App
      initialValues={initialValues}
      validators={validators}
      warningValidators={warningValidators}
      onSubmit={submit}
    />
    <GlobalStyle />
  </>,
  document.getElementById('root')
)
