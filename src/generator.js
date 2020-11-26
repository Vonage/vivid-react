const { EOL } = require('os')
const packageJson = require('../package.json')

const { outputFile, outputJson } = require('fs-extra')

const {
  compileTypescript,
  prepareDir,
  kebab2Camel,
  capitalize,
  toCommaSeparatedList,
  toJsonObjectsList,
  event2EventDescriptor,
  filePath,
  renderJsDoc,
  getIndexFileName,
  getVividPackageName
} = require('./utils')
const { getTemplate, TemplateToken } = require('./templates/templates')
const { join } = require('path')
const { OutputLanguage, FileName } = require('./consts')
const { getPropTypes, getDefaultProps, getProps } = require('./prop.types')

const generateTypings = outputDir => async tags => {
  const distTs = join(FileName.tempFolder, FileName.tempTsFolder)
  await generateWrappers(distTs, OutputLanguage.TypeScript, false, false)(tags)
  await compileTypescript(distTs)(outputDir)
}

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

const generateWrappers = (outputDir, language = OutputLanguage.JavaScript, cleanTemp = true, verbose = true) => async (tags) => {
  const indexFileName = getIndexFileName(language)
  const saveIndex = (outputDir, content) => {
    const indexOutputFileName = join(outputDir, indexFileName)
    return outputFile(
      indexOutputFileName,
      content
    )
  }
  const saveStory = (outputDir, componentName, content) => {
    const indexOutputFileName = join(outputDir, `${componentName}.stories.jsx`)
    return outputFile(
      indexOutputFileName,
      content
    )
  }
  const getIndexContent = (components) =>
    getTemplate('index', language).replace(TemplateToken.EXPORTS, components.map(getExportLine).join(EOL))
  const getStoriesContent = (componentName, tag) =>
    getTemplate('stories', 'js')
      .split(TemplateToken.COMPONENT_CLASS_NAME).join(componentName)

  prepareDir(outputDir, true, verbose)
  const components = []

  for (const tag of tags) {
    const camelizedName = kebab2Camel(tag.name)
    const componentName = capitalize(camelizedName)
    components.push(componentName)
    if (verbose) {
      console.info(`Processing ${componentName}...`)
    }

    const componentOutputDir = join(process.cwd(), outputDir, componentName)
    const storyOutputDir = join(process.cwd(), FileName.storyOutputDir, componentName)
    const componentContent = renderComponent(tag)(language)(componentName)

    await saveIndex(componentOutputDir, componentContent)
    await saveStory(storyOutputDir, componentName, getStoriesContent(componentName, tag))
    console.log('tag.properties', tag.properties)
    console.log('tag', tag.properties)

    const packageName = getVividPackageName(tag.path)
    const packageJsonContent = {
      name: `@vonage/vivid-react-${tag.name}`,
      version: packageJson.version,
      main: indexFileName,
      types: 'index.d.ts',
      private: true,
      license: 'MIT',
      dependencies: {
        [packageName]: packageJson.dependencies[packageName]
      }
    }
    await outputJson(join(componentOutputDir, FileName.packageJson), packageJsonContent, { spaces: 2 })
  }

  await saveIndex(outputDir, getIndexContent(components))

  if (language === OutputLanguage.JavaScript) {
    await generateTypings(outputDir)(tags)
  }

  prepareDir(filePath(FileName.tempFolder), cleanTemp, verbose)

  if (verbose) {
    console.info(`${components.length} wrappers generated at ${outputDir}`)
  }
}

module.exports = {
  generateWrappers
}
