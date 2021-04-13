import React from 'react'
import VwcDataGrid from '../../dist/VwcDataGrid'
import VwcDataGridColumn from '../../dist/VwcDataGridColumn'

const sequentalData = (rowBlueprint, totalRows) => {
  const result = new Array(totalRows)
  const bpMap = Object.entries(rowBlueprint)
  for (let i = 0; i < totalRows; i++) {
    const row = {}
    for (const [key, value] of bpMap) {
      row[key] = `${value.replace('{i}', i)}`
    }
    result[i] = row
  }
  return result
}

const dataSourceSimulated = sequentalData(
  { fname: 'A-{i}', lname: 'B-{i}' }, 5000
)

const dataProvider = ({ page, pageSize }, callback) => {
  const startIndex = page * pageSize
  const pageItems = dataSourceSimulated.slice(startIndex, startIndex + pageSize)
  callback(pageItems, dataSourceSimulated.length)
}

const cellRenderer = (container, configuration, data) => {
  let toggler = container.firstElementChild
  if (!toggler) {
    toggler = document.createElement('vwc-switch')
    toggler.setAttribute('connotation', 'cta')
    toggler.style.verticalAlign = 'middle'
    container.appendChild(toggler)
  }
  container.data = data
  toggler.checked = data.detailsOpened
}

export const Default = () =>
  <VwcDataGrid
    dataProvider={dataProvider}
    multiSort
    reordering={false}
  >
    <VwcDataGridColumn
      path='fname'
      header='First Name'
      autoWidth
      footer=''
    />
    <VwcDataGridColumn
      header='Last Name'
      autoWidth
      cellRenderer={cellRenderer}
      footer=''
    />
  </VwcDataGrid>

export default {
  title: 'VwcDataGrid',
  argTypes: {
  }
}
