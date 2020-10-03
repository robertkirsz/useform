import React from 'react'
import { render } from 'react-dom'
import App, { initialValues, validators, warningValidators } from 'App'
import { GlobalStyle } from 'styles'

render(
  <>
    <App
      initialValues={initialValues}
      validators={validators}
      warningValidators={warningValidators}
      onSubmit={({ values }) => console.log(values)}
    />
    <GlobalStyle />
  </>,
  document.getElementById('root')
)
