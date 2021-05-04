import React from 'react'
import initVivid from './initVivid'

const withVivid = (Component) => (props) =>
  <Component ref={(element) => initVivid(element)} {...props} />

export default withVivid
