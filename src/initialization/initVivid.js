import context from '@vonage/vvd-context'
import fonts from '@vonage/vvd-fonts'

const initVivid = (target, callback) => Promise.all([
  fonts.init(),
  context.mount(target)
]).then(callback)

export default initVivid
