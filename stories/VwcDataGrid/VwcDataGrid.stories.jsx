import React from 'react'
import ReactDOM from 'react-dom'
import VwcSwitch from '../../dist/VwcSwitch'
import VwcButton from '../../dist/VwcButton'
import VwcDataGrid from '../../dist/VwcDataGrid'
import VwcDataGridColumn from '../../dist/VwcDataGridColumn'

const sequentalData = (rowBlueprint, totalRows) => {
  const result = new Array(totalRows)
  const bpMap = Object.entries(rowBlueprint)
  for (let i = 0; i < totalRows; i++) {
    const row = {}
    for (const [key, value] of bpMap) {
      if (typeof value === 'string') {
        row[key] = `${value.replace('{i}', i)}`
      } else {
        row[key] = value
      }
    }
    result[i] = row
  }
  return result
}

const dataSourceSimulated = sequentalData(
  { fname: 'A-{i}', active: false }, 5000
)

const dataProvider = ({ page, pageSize }, callback) => {
  const startIndex = page * pageSize
  const pageItems = dataSourceSimulated.slice(startIndex, startIndex + pageSize)
  callback(pageItems, dataSourceSimulated.length)
}

const switchCellRenderer = (container, { grid }, { item }) => {
  const switchWebElement = container.firstElementChild
  if (switchWebElement) {
    // Re-use & direct update existing instance of web component
    // during vertical scroll cellRenderer is reused in a name of performance
    switchWebElement.checked = item.active
  } else {
    // First render
    ReactDOM.render(<VwcSwitch
      connotation='cta'
      onChange={() => {
        item.active = !item.active
        grid.refreshData()
      }}
      checked={item.active}
                    />, container)
  }
}

const actionCellRenderer = (container, configuration, { item }) => {
  const buttonWebElement = container.firstElementChild
  if (buttonWebElement) {
    buttonWebElement.disabled = item.active
  } else {
    // First render
    ReactDOM.render(<VwcButton.CallToAction
      disabled={item.active}
      label='Run'
      onClick={() => alert('Run!')}
                    />, container)
  }
}

const actionHeaderRenderer = (container, configuration) => {
  container.style.display = 'flex'
  container.firstElementChild.style.margin = '0 auto'
}

export const Default = () => {
  const setDataGridRef = (gridElement) => {
    // Please refere to grid API at this document
    // https://vivid.vonage.com/?path=/story/components-beta-datagrid-introduction--introduction
    console.log(gridElement)
    // gridElement.refreshData()
    // gridElement.selectItem()
    // .selectAll()
    // .deselectAll()
  }

  return (
    <VwcDataGrid
      ref={setDataGridRef}
      dataProvider={dataProvider}
      multiSort
      reordering={false}
    >
      <VwcDataGridColumn
        path='fname'
        header='First Name'
        resizable
        autoWidth
        footer=''
      />
      <VwcDataGridColumn
        header='Active'
        resizable
        cellRenderer={switchCellRenderer}
        footer=''
      />
      <VwcDataGridColumn
        header='Action'
        autoWidth
        resizable
        headerRenderer={actionHeaderRenderer}
        cellRenderer={actionCellRenderer}
        footer=''
      />
    </VwcDataGrid>
  )
}

export default {
  title: 'VwcDataGrid',
  argTypes: {
  }
}
