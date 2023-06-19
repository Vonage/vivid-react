import React from 'react'
import VwcTooltip from '../../../dist/VwcTooltip'
import VwcButton from '../../../dist/VwcButton'
import { vwcTooltipShowOnHoverDecorator } from '../../../src/patches/vwcTooltip'

export const Default = () => {
  return (
    <>
      <VwcTooltip anchor='btn' id='tooltip' text='Tooltip text' open />
      <VwcButton
        label='Button'
        disabled={true}
        aria-describedby='tooltip'
        id='btn'
      />
    </>
  )
}

export const ShowHideOnADisabledControl = () => {
  return (
    <>
      <VwcTooltip
        ref={vwcTooltipShowOnHoverDecorator()}
        anchor='btn'
        id='tooltip'
        text='Tooltip text'
      />
      <VwcButton
        label='Button'
        disabled={true}
        aria-describedby='tooltip'
        id='btn'
      />
    </>
  )
}

export default {
  title: 'V2/VwcTooltip'
}
