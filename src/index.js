import { render } from 'react-dom'
import App, { initialValues } from 'App'

const validators = {
  input: value => (value === '' ? 'Value is required' : undefined)
}

render(
  <App initialValues={initialValues} validators={validators} onSubmit={({ values }) => console.log(values)} />,
  document.getElementById('root')
)
