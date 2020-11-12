const { event2PropName } = require('./utils')

// Common

const getProperties = tag =>
  (tag.properties || [])
    .filter(prop => prop.type) // only props having certain type
    .filter(prop => /\'.*?\'/.test(prop.name)
      || /^([a-zA-Z_$][a-zA-Z\\d_$]*)$/.test(prop.name)) // only props having valid names

const getEvents = tag => (tag.events || []).map(x => event2PropName(x.name))

// TypeScript

const getProps = tag => {
  const eventsProps = getEvents(tag).map(x => `  ${x}?: (event: Event) => void`)

  const properties = getProperties(tag)
  const props = properties.map(x => `  ${x.name}?: ${x.type}`)
  return [
    ...eventsProps,
    ...props
  ]
}

// JavaScript

const getDefaultProps = tag => {
  const defaultProperties = (tag.properties || []).filter(x => x.default)
  return defaultProperties.map(x => `  ${x.name}: ${x.default}`)
}

const getPropTypes = tag => {
  const eventsPropTypes = getEvents(tag).map(x => `  ${x}: PropTypes.func`)

  const properties = getProperties(tag)
  const isBoolean = type => /(true|false)/.test(type)
  const isNumber = type => /(integer)/.test(type) || type === 'number | null'
  const isString = type => type === 'string | undefined' || type === 'string | null'
  const isTypeSet = type => /(\".*?\" \|)/.test(type)
  const getSetTypeOptions = setType => setType.split('|').map(x => x.trim())
  const mapTypeToPropType = type => ['boolean', 'string', 'number', 'array'].indexOf(type) >= 0
    ? (type === 'boolean' ? 'bool' : type)
    : isTypeSet(type) ? `oneOf([${getSetTypeOptions(type).join(',')}])`
      : isString(type) ? 'string' : isNumber(type) ? 'number' : isBoolean(type) ? 'bool' : `any /* ${type} */`
  const propertiesPropTypes = properties.map(x =>
    `  ${x.name}: PropTypes.${mapTypeToPropType(x.type.toLowerCase())}${x.default ? `/* default: ${x.default} */` : ''}`)

  return [
    ...eventsPropTypes,
    ...propertiesPropTypes
  ]
}

module.exports = {
  // JavaScript
  getDefaultProps,
  getPropTypes,

  // TypeScript
  getProps
}
