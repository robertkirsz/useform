# useForm
A React Hook for handling forms

```bash
npm install @robertkirsz/useform
```

##### Simplest usable example:

```js
import useForm from '@robertkirsz/useform'

function App() {
  const form = useForm({
    initialValues: { firstName: 'Kasia' },
    onSubmit: values => { /* Do something with values */ }
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.inputs.firstName} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

##### Validation:

```js
const form = useForm({
  initialValues: { firstName: '' },
  validators = { firstName: value => value === '' && 'Value required' }
})
```

##### Warnings:

```js
const form = useForm({
  initialValues: { comment: '' },
  warningValidators = { comment: value => value === '' && 'You sure you have nothing to say?' }
})
```

##### Setting values directly:

```js
form.setValue('firstName', 'Marzena')
```

##### Triggering validation programatically:

```js
form.validateField('firstName')
form.touchField('firstName')
```
We need to "touch" the field first, because "untouched" fields don't show validation statuses.

##### Setting validation errors directly:

```js
form.setError('firstName', 'Name must be "Marzenka"!')
form.touchField('firstName')
```

##### Showing that the form is submitting:

```js
<button type="submit">
  {form.isSubmitting ? 'Submitting...' : 'Submit'}
</button>
```

##### Dev tools

You can import `UseFormDevTools` helper component that shows a preview of form values andd validation statuses in the lower-right corner of the window.

First, you need to wrap your app with `UseFormDevToolsContextProvider` and render `UseFormDevTools` inside of it.

```js
import UseFormDevTools, { UseFormDevToolsContextProvider } from '@robertkirsz/useform/devtools'

function App() {
  return (
    <UseFormDevToolsContextProvider>
      <YourComponents />
      <UseFormDevTools />
    </UseFormDevToolsContextProvider>
  )
}
```

Components that use `useForm` must be inside the provider as well (they don't need to be called `YourComponents` of course).

Then you need to connect your forms to the provider:

```js
import useForm from '@robertkirsz/useform'
import { UseFormDevToolsContext } from '@robertkirsz/useform/devtools'

function App() {
  const form = useForm({
    initialValues: { firstName: 'Marzena' },
    onSubmit: values => { /* Do something with values */ },
    devToolsContext: UseFormDevToolsContext, // Here we connect the form to dev tools
    name: 'My form' // Optional - if you have multiple forms, you can name them to differentiate them in dev tools
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.inputs.firstName} />
      <button type="submit">Submit</button>
    </form>
  )
}

```
