import React from 'react'
import VwcDataGrid from '../../../dist/VwcDataGrid'
import VwcSlider from '../../../dist/VwcSlider'
import VwcDataGridColumn from '../../../dist/VwcDataGridColumn'
import VwcTooltip from '../../../dist/VwcTooltip'
import VwcButton from '../../../dist/VwcButton'
import VwcNote from '../../../dist/VwcNote'
import VwcSelect from '../../../dist/VwcSelect'
import VwcListItem from '../../../dist/VwcListItem'
import VwcSnackbar from '../../../dist/VwcSnackbar'
import VwcIconButton from '../../../dist/VwcIconButton'

import {
  cellRendererFactory,
  vwcDataGridElementCellOverflowDecorator,
  vwcTooltipShowOnHoverDecorator
} from '../../../src'
import { vwcNoteContentOverflowDecorator } from '../../../src/patches/vwcNoteContentOverflow'
import { vwcSnackBarHtmlMessageDecorator } from '../../../src/patches/vwcSnackBarHtmlMessage'
import { vwcSetAttributeValue } from '../../../src/patches/vwcSetAttributeValue'

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

const sliderCellRenderer = (container, { grid }, { item }) =>
  cellRendererFactory(
    <VwcSlider pin step={1} value={5} min={1} max={10} />,
    container
  )

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

export const SnackBarWithHTMLContent = () => (
  <VwcSnackbar
    ref={vwcSnackBarHtmlMessageDecorator(
      'This is <i>truly</i> html <b>message</b>'
    )}
    onClosed={e => (e.target.open = true)}
    legacy
    header='html message demo'
    dismissible
    icon='info'
    open
    timeoutMs={9000}
  ></VwcSnackbar>
)

export const VwcIconButtonValue = () => (
  <VwcIconButton ref={vwcSetAttributeValue('value', 'v')}></VwcIconButton>
)

export default {
  title: 'V2/Patches'
}
