# useForm
A React Hook for handling forms

```bash
npm install @robertkirsz/useform
```

## Simplest usable example:

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

## Validation:

```js
const form = useForm({
  initialValues: { firstName: '' },
  validators = { firstName: value => value === '' && 'Value required' }
})
```

## Warnings:

```js
const form = useForm({
  initialValues: { comment: '' },
  warningValidators = { comment: value => value === '' && 'You sure you have nothing to say?' }
})
```

## Setting values directly:

```js
form.setValue('firstName', 'Marzena')
```

## Triggering validation programatically:

```js
form.validateField('firstName')
form.touchField('firstName')
```
We need to "touch" the field first, because "untouched" fields don't show validation statuses.

## Setting validation errors directly:

```js
form.setError('firstName', 'Name must be "Marzenka"!')
form.touchField('firstName')
```

## Showing that the form is submitting:

For that, you need to return a [Promise](https://javascript.info/promise-basics) from your `onSubmit` function, like that:

```js
function App() {
  const form = useForm({
    initialValues: { firstName: 'Kasia' },
    onSubmit: values => new Promise(resolve => {
      /* Do something with values, probably you want to send them to a server */
      resolve()
    })
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.inputs.firstName} />
      <button type="submit">
        {form.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```
