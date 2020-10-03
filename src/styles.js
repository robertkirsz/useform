import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: sans-serif;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #app > *:not(:first-child) {
    margin-top: 24px;
  }

  form {
    display: flex;
    flex-direction: column;
    max-width: 320px;
    width: 100%;
    margin: auto;
    border: 1px solid;
    padding: 8px;
    border-radius: 4px;
  }

  form > *:not(:first-child) {
    margin-top: 16px;
  }
`
