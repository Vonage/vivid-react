import React from 'react'
import VwcCard from '../../dist/VwcCard'
import VwcIconButton from '../../dist/VwcIconButton'
import { vwcCardHeadingCropDecorator } from '../../src'

const originalText = 'very loooooo ngt te eeex tkjhn klhkjg hlkjh kjuhk jhkjh kjhk jhk jhjk'
const damnLoongWordText = 'veryloooooongtteeeextkjhnklhkjghlkjhkjuhkjhkjhkjhk jhk jhjk'

export const Default = () => (
  <>
    <div
      style={{
        width: '200px'
      }}
    >
      <VwcCard
        style={{
          '--title-line-clamp': 2
        }}
        heading={originalText}
        ref={vwcCardHeadingCropDecorator(originalText)}
        subtitle='Subtitle'
      ></VwcCard>
    </div>

    <div
      style={{
        width: '200px'
      }}
    >
      <VwcCard
        style={{
          '--title-line-clamp': 2
        }}
        heading={damnLoongWordText}
        ref={vwcCardHeadingCropDecorator(damnLoongWordText)}
        subtitle='Subtitle'
      ></VwcCard>
    </div>

    <VwcCard
      label='All Options'
      heading='All Options on Deck'
      icon='chat-line'
      subtitle='Subtitle'
      text="Use the 'footer' slot in order to add actionable items."
    >
      <VwcIconButton
        slot='graphic'
        connotation='alert'
        icon='bin'
        shape='circled'
      />
      <div
        style={{
          height: '150px',
          width: '100%',
          backgroundColor: '#871EFF'
        }}
        slot='media'
      ></div>
      <VwcIconButton
        slot='meta'
        connotation='alert'
        icon='bin'
        shape='circled'
      />
      <VwcIconButton
        slot='footer'
        connotation='alert'
        icon='bin'
        shape='circled'
      />
    </VwcCard>
  </>
)
export default {
  title: 'VwcCard',
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
