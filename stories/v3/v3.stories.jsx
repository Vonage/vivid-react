import React from 'react'
import VwcBadge from '../../dist/v3/VwcBadge'
import VwcButton from '../../dist/v3/VwcButton'
import '@vonage/vivid/styles/fonts/spezia.css'
import '@vonage/vivid/styles/tokens/theme-light.css'

export const VwcBadge_ = () =>
  <div class="vvd-root">
    <VwcBadge connotation={'alert'} text={'Badge'} />
    <VwcButton connotation={'info'} label='Button' onClick={(e) => console.log(e)} ></VwcButton>

  </div>

export default {
  title: 'V3',
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
