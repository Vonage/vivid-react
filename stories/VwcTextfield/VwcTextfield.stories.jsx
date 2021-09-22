import React, { useState } from 'react'
import VwcTextfield from '../../dist/VwcTextfield'
import { action } from '@storybook/addon-actions'

export const Default = () => <VwcTextfield/>

export const Validation = () => {
  const [errorMessage, setErrorMessage] = useState('')

  return <VwcTextfield
    style={{ width: '100%' }}
    pattern='[a-zA-Z0-9 ]*'
    required
    validationMessage={errorMessage}
    validityTransform={(newValue, nativeValidity) => {
      action('validity')(newValue, nativeValidity)
      if (nativeValidity.patternMismatch) {
        setErrorMessage('You can only use letters and numbers')
      } else if(nativeValidity.valueMissing) {
        setErrorMessage('Field is required')
      }
    }}
  />
}

export default {
  title: 'VwcTextfield',
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
