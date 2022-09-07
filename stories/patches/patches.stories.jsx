import React from 'react'
import ReactDOM from 'react-dom'
import VwcDataGrid from '../../dist/VwcDataGrid'
import VwcSlider from '../../dist/VwcSlider'
import VwcDataGridColumn from '../../dist/VwcDataGridColumn'
import VwcTooltip from '../../dist/VwcTooltip'
import VwcButton from '../../dist/VwcButton'
import VwcNote from '../../dist/VwcNote'
import VwcSelect from '../../dist/VwcSelect'
import VwcListItem from '../../dist/VwcListItem'

import {
  vwcDataGridElementCellOverflowDecorator,
  vwcTooltipShowOnHoverDecorator
} from '../../src'
import { vwcNoteContentOverflowDecorator } from '../../src/patches/vwcNoteContentOverflow'

export const VwcTooltipShowOnHover = () => (
  <>
    <VwcTooltip
      ref={vwcTooltipShowOnHoverDecorator()}
      anchor='btn'
      id='tooltip'
      text='Tooltip text'
    />
    <VwcButton label='Button' aria-describedby='tooltip' id='btn' />
  </>
)

const sliderCellRenderer = (container, { grid }, { item }) => {
  const webElement = container.firstElementChild
  if (webElement) {
    // Re-use & direct update existing instance of web component
    // during vertical scroll cellRenderer is reused in a name of performance
  } else {
    // First render
    ReactDOM.render(
      <VwcSlider pin step={1} value={5} min={1} max={10} />,
      container
    )
  }
}

const dataProvider = ({ page, pageSize }, callback) => {
  callback([{}], 1)
}

export const DataGridCellOverflow = () => (
  <VwcDataGrid
    ref={vwcDataGridElementCellOverflowDecorator}
    dataProvider={dataProvider}
  >
    <VwcDataGridColumn
      header='Level'
      resizable
      cellRenderer={sliderCellRenderer}
      footer=''
    />
  </VwcDataGrid>
)

export const AllowContentOverflow = () => (
  <VwcNote
    ref={vwcNoteContentOverflowDecorator}
    header='Allow dropdown content overflow the Note card boundaries'
  >
    <VwcSelect>
      <VwcListItem>Item 1</VwcListItem>
      <VwcListItem>Item 1</VwcListItem>
      <VwcListItem>Item 1</VwcListItem>
      <VwcListItem>Item 1</VwcListItem>
      <VwcListItem>Item 1</VwcListItem>
    </VwcSelect>
  </VwcNote>
)

export default {
  title: 'Patches'
}
