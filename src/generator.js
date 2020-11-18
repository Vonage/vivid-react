const { EOL } = require('os')
const packageJson = require('../package.json')

const { outputFile } = require('fs-extra')

const {
  prepareDir,
  kebab2Camel,
  capitalize,
  toCommaSeparatedList,
  toJsonObjectsList,
  event2EventDescriptor,
  filePath,
  renderJsDoc,
  getInputArgument,
  getVividPackageName
} = require('./utils')
const { getTemplate, TemplateToken } = require('./templates/templates')
const { writeFileSync } = require('fs')
const { join } = require('path')
const { OutputLanguage, tempFolder, CLIArgument } = require('./consts')
const { getPropTypes, getDefaultProps, getProps } = require('./prop.types')

const renderComponent = tag => language => componentName => {
  const flatEventsList = (tag.events || []).map(x => (typeof x === 'string' ? x : x.name))
  const result = getTemplate('react-component', language)
    .replace(TemplateToken.CLASS_JSDOC, renderJsDoc(tag))
    .replace(TemplateToken.IMPORTS, `import '${getVividPackageName(tag.path)}'`)
    .replace(TemplateToken.EVENTS, toJsonObjectsList(flatEventsList.map(event2EventDescriptor)))
    .replace(TemplateToken.PROPERTIES, toCommaSeparatedList(tag.properties))
    .replace(TemplateToken.ATTRIBUTES, toCommaSeparatedList(tag.attributes))
    .replace(TemplateToken.PROP_TYPES, getPropTypes(tag).join(',\n'))
    .replace(TemplateToken.PROPS, getProps(tag).join(',\n'))
    .replace(TemplateToken.DEFAULT_PROPS, getDefaultProps(tag).join(',\n'))
    .replace(TemplateToken.TAG_DESCRIPTOR_JSON, JSON.stringify(tag, null, ' '))
    .replace(new RegExp(TemplateToken.COMPONENT_CLASS_NAME, 'g'), componentName)
    .replace(new RegExp(TemplateToken.TAG, 'g'), tag.name)

  return result
}

const getExportLine = componentName => `export { default as ${componentName} } from './${componentName}'`

const saveIndex = (outputDir, language, components) => {
  const indexOutputFileName = join(process.cwd(), outputDir, `index.${language}`)
  writeFileSync(
    indexOutputFileName,
    getTemplate('index', language)
      .replace(TemplateToken.EXPORTS, components.map(getExportLine).join(EOL))
  )
}

const saveComponent = async (outputDir, language, content) => {
  const indexOutputFileName = join(process.cwd(), outputDir, `index.${language}`)

  await outputFile(
    indexOutputFileName,
    content
  )
}

const generateWrappers = (outputDir, language = OutputLanguage.JavaScript) => async (tags) => {
  prepareDir(outputDir, true)
  const components = []

  for (const tag of tags) {
    const camelizedName = kebab2Camel(tag.name)
    const componentName = capitalize(camelizedName)
    components.push(componentName)
    console.info(`Processing ${componentName}...`)

    const componentOutputDir = join(process.cwd(), outputDir, componentName)
    const componentContent = renderComponent(tag)(language)(componentName)

    await saveComponent(componentOutputDir, language, componentContent)

    console.log({ tag })

    const packageJsonContent = {
      name: `@vonage/vivid-react-${componentName.toLowerCase()}`,
      version: packageJson.version,
      main: `index.${language}`,
      license: 'MIT',
      dependencies: {}
    }
  }

  saveIndex(outputDir, language, components)

  prepareDir(filePath(tempFolder), getInputArgument(CLIArgument.CleanTemp, true) !== 'false')

  console.info(`${components.length} wrappers generated at ${outputDir}`)
}

module.exports = {
  generateWrappers
}
