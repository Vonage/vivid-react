import React from 'react'
import VwcList from '../../dist/VwcList'
import VwcListItem from '../../dist/VwcListItem'
import VwcBadge from '../../dist/VwcBadge'
import VwcIcon from '../../dist/VwcIcon'
import VwcSelect from '../../dist/VwcSelect'
import VwcButton from '../../dist/VwcButton'

export default {
  title: 'WithItemsTest',
  argTypes: {
    // value: { control: 'number' },
    activatable: { control: 'boolean' },
    multi: { control: 'boolean' },
    wrapFocus: { control: 'boolean' },
    noninteractive: { control: 'boolean' },
    rootTabbable: { control: 'boolean' },
  }
}


export const List = (args) => <VwcList {...args} >
  <VwcListItem>Item 1</VwcListItem>
  <VwcListItem>Item 2</VwcListItem>
  <VwcListItem>Item 3</VwcListItem>
</VwcList>

export const ListNative = (args) => <vwc-list {...args} >
  <vwc-list-item>Item 1</vwc-list-item>
  <vwc-list-item>Item 2</vwc-list-item>
  <vwc-list-item>Item 3</vwc-list-item>
</vwc-list>
ListNative.args = {}

export const Select = (args) => <VwcSelect {...args} >
  <VwcListItem>Item 1</VwcListItem>
  <VwcListItem>Item 2</VwcListItem>
  <VwcListItem>Item 3</VwcListItem>
</VwcSelect>
List.args = {}

export const Badge = (args) => <VwcBadge {...args} >
  badge-text
</VwcBadge>
Badge.args = {}

export const IconButton = (args) => <VwcButton {...args} >
  <VwcIcon type="heart"/>
</VwcButton>
IconButton.args = {}


