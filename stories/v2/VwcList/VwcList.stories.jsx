import React from 'react'
import VwcCheckListItem from '../../dist/VwcCheckListItem'
import VwcList from '../../dist/VwcList'

export const Default = () => (
  <VwcList>
    <VwcCheckListItem />
    <VwcCheckListItem />
    <VwcCheckListItem />
  </VwcList>
)
export default {
  title: 'V2/VwcList',
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
