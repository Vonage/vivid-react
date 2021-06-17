import React from 'react'
import VwcChipSet from '../../dist/VwcChipSet'
import VwcChip from '../../dist/VwcChip'

export const Default = (argTypes) =>
  <VwcChipSet {...argTypes}>
    <VwcChip label='Chip one' />
    <VwcChip label='Chip two' />
    <VwcChip label='Chip three' />
  </VwcChipSet>

export const Filter = (argTypes) =>
  <VwcChipSet {...argTypes}>
    <VwcChip label='Chip one' selected />
    <VwcChip label='Chip two' />
    <VwcChip label='Chip three' />
  </VwcChipSet>

export default {
  title: 'VwcChipSet',
  argTypes: {
    type: {
      options: ['action', 'input', 'choice', 'filter'],
      control: { type: 'select' },
      defaultValue: 'filter'
    },
    onSelection: { action: 'onSelection' },

    //
    // Example values
    // numberValue: { control: 'number', defaultValue: 123 },
    // booleanValue: { control: 'boolean', defaultValue: true },
    // objectValue: { control: 'object', defaultValue: {} },
    // stringValue: { control: 'string', defaultValue: 'string' },
    // colorValue: { control: 'color' },
    // dateValue: { control: 'date' }
  }
}
