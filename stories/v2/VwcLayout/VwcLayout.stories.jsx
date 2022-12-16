import React from 'react'
import VwcLayout from '../../dist/VwcLayout'
import VwcCard from '../../dist/VwcCard'

const testData = [
  'understand cognitive dangerous child consistent efficient temperature limit silver viewer ',
  'capital wet aware executive anyone typically cow bother apart reduce bother cow ',
  'song chef crop need permanent management drawing pure likely competitor competitor ',
  'global chemical flight demonstration sigh highway gradually threat introduce than global ',
  'whereas birth finish maker chest ourselves celebrate different routine serve different ',
  'bedroom act another military count team tight aspect die anymore tight tight count ',
  'everyday tomato landscape ahead soft spend ensure overcome earn letter ensure ',
  'recognize bomb meter solve engineering breakfast nonetheless habit physician consist recognize ',
  'soft document limitation replace asleep exhibition faculty accident big study exhibition ',
  'explode inflation lift clue certainly practice accompany choose beneath cope cope '
]

export const Default = () => {
  return (
    <>
      <VwcLayout>
        {testData.map((d, i) => (
          <VwcCard key={i} text={d} />
        ))}
      </VwcLayout>
      <VwcLayout columnBasis='sm' columnSpacing='xs'>
        {testData.map((d, i) => (
          <VwcCard key={i} text={d} />
        ))}
      </VwcLayout>
      <VwcLayout columnBasis='md' columnSpacing='md'>
        {testData.map((d, i) => (
          <VwcCard key={i} text={d} />
        ))}
      </VwcLayout>
      <VwcLayout columnBasis='lg' columnSpacing='md'>
        {testData.map((d, i) => (
          <VwcCard key={i} text={d} />
        ))}
      </VwcLayout>
      <VwcLayout columnBasis='block'>
        {testData.map((d, i) => (
          <VwcCard key={i} text={d} />
        ))}
      </VwcLayout>
    </>
  )
}

export default {
  title: 'V2/VwcLayout',
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
