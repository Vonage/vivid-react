import React from 'react'
import VwcBadge from '../../dist/v3/VwcBadge'
import '@vonage/vivid/styles/fonts/spezia.css'
import '@vonage/vivid/styles/tokens/theme-light.css'


export const Default = () => <div class="vvd-root"><VwcBadge>Badge</VwcBadge></div>

export default {
  title: 'V3/VwcBadge',
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
