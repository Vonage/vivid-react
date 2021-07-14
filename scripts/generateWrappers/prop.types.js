const { event2PropName, getProperties } = require('./utils')

// Common

const getEvents = tag => (tag.events || []).map(x => x.propName || event2PropName(x.name || x))
const isTypeSet = type => /(".*?" \|)/.test(type)
const isStringTypeSet = type => /".*"[ |]?/.test(type) && /".*"[ |]?/.exec(type)[0] === type
const isBoolean = type => /^(true|false)$/.test(type) || type === 'boolean'
const isArray = type => /(.*)\[\]$/gm.test(type) || type === 'array'
const isNumber = type => /(integer)/.test(type) || type === 'number | null'

// TypeScript

const getProps = tag => {
  const eventsProps = getEvents(tag).map(x => `  ${x}?: (event: Event) => void`)

  const properties = getProperties(tag)
  const mapType = type => ([
    'boolean',
    'Boolean',
    'string',
    'string | null',
    'string | undefined',
    'string | number',
    'number',
    'unknown'].indexOf(type) >= 0 ||
  isTypeSet(type))
    ? type
    : isBoolean(type)
      ? 'boolean'
      : isNumber(type)
        ? 'number'
        : isArray(type)
            ? 'any[]'
            : `any /* ${type} */`
  const props = properties.map(x => `  ${x.name}?: ${mapType(x.type)}`)

  return [
    ...eventsProps,
    ...props
  ]
}

// JavaScript

const getDefaultProps = tag => {
  const defaultProperties = getProperties(tag).filter(x => x.default)
  return defaultProperties.map(x => `  ${x.name}: ${x.default}`)
}

const getPropTypes = tag => {
  const eventsPropTypes = getEvents(tag).map(x => `  ${x}: PropTypes.func`)

  const properties = getProperties(tag)
  const isString = type => type === 'string | undefined' || type === 'string | null'
  const getSetTypeOptions = setType => setType.split('|').map(x => x.trim())
  const mapTypeToPropType = type => ['boolean', 'string', 'number', 'array'].indexOf(type) >= 0
    ? (type === 'boolean' ? 'bool' : type)
    : isStringTypeSet(type)
      ? `oneOf([${getSetTypeOptions(type).join(',')}])`
      : isString(type)
        ? 'string'
        : isNumber(type)
          ? 'number'
          : isArray(type)
            ? 'array' 
            : isBoolean(type)
              ? 'bool'
              : `any /* ${type} */`
  const propertiesPropTypes = properties.map(x =>
    `  ${x.name}: PropTypes.${mapTypeToPropType(x.type?.toLowerCase())}${x.default ? `/* default: ${x.default} */` : ''}`)

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
