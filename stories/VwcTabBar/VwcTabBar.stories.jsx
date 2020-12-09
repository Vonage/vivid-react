import React, { useState } from 'react'
import VwcTabBar from '../../dist/VwcTabBar'
import VwcTab from '../../dist/VwcTab'

export const Default = () => <VwcTabBar/>

export const SwitchingContent = () => {
  const [activeTab, switchTab] = useState(0)
  const onActivatedTab = ({ detail: { index } }) => switchTab(index)

  return <React.Fragment>
    <VwcTabBar
      activeIndex={activeTab}
      onActivated={onActivatedTab}
    >
      <VwcTab
        label='Tab 1'
      />
      <VwcTab
        label='Tab 2'
      />
    </VwcTabBar>
    {activeTab === 0 && <div>Tab 1 contents</div>}
    {activeTab === 1 && <div>Tab 2 contents</div>}
  </React.Fragment>
}
export const LimitWidth = () => {
  const [activeTab, switchTab] = useState(0)
  const onActivatedTab = ({ detail: { index } }) => switchTab(index)

  return <React.Fragment>
    <div style={{ display: 'inline-block' }}>
      <VwcTabBar
        activeIndex={activeTab}
        onActivated={onActivatedTab}
      >
        <VwcTab
          label='Tab 1'
        />
        <VwcTab
          label='Tab 2'
        />
      </VwcTabBar>
    </div>
    {activeTab === 0 && <div>Tab 1 contents</div>}
    {activeTab === 1 && <div>Tab 2 contents</div>}
  </React.Fragment>
}

export default {
  title: 'VwcTabBar',
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
