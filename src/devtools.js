import React, { useState, createContext, useContext } from 'react'
import styled, { css } from 'styled-components'

// TODO: remove
import Div from 'styled-kit/Div'

const localStorageExists = () => typeof localStorage !== 'undefined'

export const UseFormDevToolsContext = createContext()

export function UseFormDevToolsContextProvider({ children = null }) {
  const [forms, setForms] = useState([])

  function updateFormInDevTools({ name, ...data }) {
    setForms(state => {
      return state.find(form => form.name === name)
        ? state.map(form => (form.name === name ? { name, ...data } : form))
        : [...state, { name, ...data }]
    })
  }

  function removeFormFromDevTools(name) {
    setForms(state => state.filter(form => form.name !== name))
  }

  return (
    <UseFormDevToolsContext.Provider value={{ forms, updateFormInDevTools, removeFormFromDevTools }}>
      {children}
    </UseFormDevToolsContext.Provider>
  )
}

export default function UseFormDevTools() {
  const { forms } = useContext(UseFormDevToolsContext)

  const [isVisible, setIsVisible] = useState(localStorageExists() && localStorage.getItem('useFormDevTools') === 'true')

  function handleWrapperClick(event) {
    if (!isVisible && event.target === event.currentTarget) {
      setIsVisible(true)
      localStorageExists() && localStorage.setItem('useFormDevTools', true)
    }
  }

  function handleClose() {
    setIsVisible(false)
    localStorageExists() && localStorage.setItem('useFormDevTools', false)
  }

  if (!forms || forms.length === 0) return null

  return (
    <Wrapper column listBottom={16} onClick={handleWrapperClick} clickable={!isVisible} isVisible={isVisible}>
      {!isVisible && 'Forms'}

      {isVisible && (
        <>
          <CloseButton onClick={handleClose}>x</CloseButton>

          {forms.map(form => (
            <Div key={form.name} column listTop={3} css="overflow: auto;">
              <strong>{form.name}</strong>

              {Object.entries(form.values).map(([field, value]) => {
                const error = form.errors[field]
                const warning = form.warnings[field]

                return (
                  <Div key={field} listLeft={4}>
                    <em>{field}:</em>
                    <Value hasError={Boolean(error)} hasWarning={Boolean(warning)} title={String(value)}>
                      {String(value)}
                    </Value>
                  </Div>
                )
              })}
            </Div>
          ))}
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled(Div)`
  position: fixed;
  bottom: 12px;
  right: 16px;
  z-index: 100;

  max-height: calc(100vh - 24px);
  padding: 8px 12px;

  font: 14px sans-serif;

  background: rgba(255, 255, 255, 0.3);
  border: 4px solid white;
  border-radius: 8px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(25px);
  transition: 0.3s;

  &:hover {
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.3);
  }

  ${({ isVisible }) => isVisible && 'box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.3);'}
`

const Value = styled.strong`
  flex: none;
  min-width: 16px;
  max-width: 200px;
  padding: 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  border-radius: 4px;
  transition: 0.3s;

  ${({ hasWarning, hasError }) => css`
    ${hasWarning && `background: rgba(255 ,255, 0, 0.4);`}
    ${hasError && `background: rgba(255, 0, 0, 0.4);`}
  `}
`

const CloseButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;

  width: 16px;
  height: 16px;
  padding: 0;

  font: 12px sans-serif;
  text-align: center;
  cursor: pointer;

  background: white;
  border-radius: 6px;
  border: none;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
  outline: none;
`
