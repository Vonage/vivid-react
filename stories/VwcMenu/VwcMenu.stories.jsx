import React from 'react'
import VwcMenu from '../../dist/VwcMenu'
import VwcButton from '../../dist/VwcButton'
import VwcListItem from '../../dist/VwcListItem'

function anchorClickHandler () {
  const anchor = document.querySelector('#button')
  const menu = document.querySelector('#menu')
  menu.anchor = anchor
  menu.open = true
}

export const Default = () => (
  <>
    <VwcButton
      id='button'
      label='Open menu'
      onClick={() => anchorClickHandler()}
    ></VwcButton>
    <VwcMenu
      id='menu'
      corner='BOTTOM_RIGHT'
      onSelected={e => console.log(`Selected: `, e)}
      onAction={e => console.log(`Action: `, e)}
      onOpened={e => console.log(`Opened: `, e)}
      onClosed={e => console.log(`Closed: `, e)}
    >
      <VwcListItem>
        <div>Basic item 1</div>
      </VwcListItem>
      <VwcListItem>
        <div>Basic item 2</div>
      </VwcListItem>
    </VwcMenu>
  </>
)

export default {
  title: 'VwcMenu',
  argTypes: {}
}
