import '@vonage/vvd-context'
import fonts from '@vonage/vvd-fonts'

const initVivid = (callback) => fonts.init().then(callback)

export default initVivid
