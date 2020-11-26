import React from 'react'
import VwcSlider from '../../dist/VwcSlider'

export default {
  title: 'xxx',
  argTypes: {
    value: { control: 'number' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' }
  }
}
export const Basic = (args) => <VwcSlider {...args} />
Basic.args = {}

export const Test = (args) => <VwcSlider {...args} />
Test.args = { disabled: false, value: 5, minValue: 1, maxValue: 100, onChange: (e) => console.log(e) }
