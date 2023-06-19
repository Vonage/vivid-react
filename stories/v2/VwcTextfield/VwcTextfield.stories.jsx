import React, { useState } from 'react'
import VwcTextfield from '../../../dist/VwcTextfield/index'
import { action } from '@storybook/addon-actions'

export const Default = () => (
  <VwcTextfield
    onBlur={x => console.log(x)}
    onFocus={x => console.log(x)}
    onInput={x => console.log(x)}
  />
)

export const Validation = () => {
  const [errorMessage, setErrorMessage] = useState('')

  return (
    <VwcTextfield
      style={{ width: '100%' }}
      pattern='[a-zA-Z0-9 ]*'
      required
      validationMessage={errorMessage}
      validityTransform={(newValue, nativeValidity) => {
        action('validity')(newValue, nativeValidity)
        if (nativeValidity.patternMismatch) {
          setErrorMessage('You can only use letters and numbers')
        } else if (nativeValidity.valueMissing) {
          setErrorMessage('Field is required')
        }
      }}
    />
  )
}

export default {
  title: 'V2/VwcTextfield',
  argTypes: {
    //
    // Example values
    // numberValue: { control: 'number', defaultValue: 123 },
    // booleanValue: { control: 'boolean', defaultValue: true },
    // objectValue: { control: 'object', defaultValue: {} },
    // stringValue: { control: 'string', defaultValue: 'string' },
    // colorValue: { control: 'color' },
    // dateValue: { control: 'date' }
    //
  }
}
