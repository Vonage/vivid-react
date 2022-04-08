import React from 'react'
import VwcTooltip from '../../dist/VwcTooltip'
import VwcButton from '../../dist/VwcButton'

export const Default = () => {
  return (
    <>
      <VwcTooltip anchor='btn' id='tooltip' text='Tooltip text' open />
      <VwcButton label='Button' aria-describedby='tooltip' id='btn' />
    </>
  )
}

export default {
  title: 'VwcTooltip'
}
