import context from '@vonage/vvd-context'
import fonts from '@vonage/vvd-fonts'

const initVivid = (callback) => Promise.all([
  fonts.init(),
  context.mount()
]).then(callback)

export default initVivid
