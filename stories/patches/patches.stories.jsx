import React from 'react'
import ReactDOM from 'react-dom'
import VwcDataGrid from '../../dist/VwcDataGrid'
import VwcSlider from '../../dist/VwcSlider'
import VwcDataGridColumn from '../../dist/VwcDataGridColumn'
import {
  vwcTooltipEllipsisDecorator,
  vwcDataGridElementCellOverflowDecorator
} from '../../src'

const originalText = 'very loooooong tteeeext'

export const VwcTooltip = () => (
  <>
    <span
      style={{ width: '80px' }}
      ref={vwcTooltipEllipsisDecorator(originalText)}
    >
      {originalText}
    </span>
    <span ref={vwcTooltipEllipsisDecorator(originalText)}>{originalText}</span>
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

export default {
  title: 'Patches'
}