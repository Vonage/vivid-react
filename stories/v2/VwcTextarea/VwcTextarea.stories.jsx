import React from 'react'
import VwcTextarea from '../../dist/VwcTextarea'

export const Default = () => (
  <VwcTextarea
    onFocus={x => console.log(x)}
    onInput={x => console.log(x)}
    onBlur={x => console.log(x)}
  />
)
export default {
  title: 'V2/VwcTextarea',
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
