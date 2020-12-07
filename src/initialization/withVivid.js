import React from 'react'
import initVivid from './initVivid'

const withVivid = (Component) => (props) => {
  initVivid()
  return <Component {...props} />
}

export default withVivid
