import React from 'react'
import VwcTextfield from '../../dist/VwcTextfield'
import { action } from '@storybook/addon-actions'

export const Default = () =>
  <VwcTextfield
    pattern='[a-zA-Z0-9 ]*'
    required
    validityTransform={action('validity')}
  />

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
