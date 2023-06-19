import React from 'react'
import VwcButtonToggleGroup from '../../../dist/VwcButtonToggleGroup'
import VwcButton from '../../../dist/VwcButton'

export const Default = () => {
  return (
    <VwcButtonToggleGroup required values={['foo']}>
      <VwcButton value='foo'>Foo</VwcButton>
      <VwcButton value='bar'>Bar</VwcButton>
    </VwcButtonToggleGroup>
  )
}

export const RealtimeValuesSet = () => {
  return (
    <VwcButtonToggleGroup
      values={[]}
      ref={btnGroupElement =>
        setTimeout(() => {
          if (!btnGroupElement) {
            return
          }
          btnGroupElement.values = ['bar']
        }, 0)
      }
      required
    >
      <VwcButton value='foo'>Foo</VwcButton>
      <VwcButton value='bar'>Bar</VwcButton>
    </VwcButtonToggleGroup>
  )
}

export default {
  title: 'V2/VwcButtonToggleGroup',
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
