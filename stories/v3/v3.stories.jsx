import React from 'react'
import VwcBadge from '../../dist/v3/VwcBadge'
import VwcButton from '../../dist/v3/VwcButton'
import { initVivid } from '../../src/initialization/initVivid'

export const VwcBadge_ = () =>
  <>
    <VwcBadge connotation={'alert'} text={'Badge'} />
    <VwcButton connotation={'info'} label='Button' onClick={(e) => console.log(e)} ></VwcButton>
  </>

export default {
  title: 'V3',
  decorators: [
    (story) => {
      const InitVivid = ({ children }) => <div ref={x => {
        if (!x) {
          return
        }
        initVivid(x, () => {}, {
          font: 'proprietary',
          theme: 'light'
        })
      }} >{children}</div>
      return <InitVivid>{story()}</InitVivid>
    }
  ]
}
