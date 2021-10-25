const packageJson = require('../../package.json')
const { getImportsFromTag } = require('./helpers/generator')
const {
  ComponentsEventsMap,
  CompoundComponentsMap,
  OutputLanguage,
  FileName
} = require('./consts')

const { pathExists, outputFile, outputJson } = require('fs-extra')

const {
  compileTypescript,
  prepareDir,
  getComponentName,
  toJsonObjectsList,
  filePath,
  renderJsDoc,
  getIndexFileName,
  getProperties,
  getUniqueEvents,
  getVividPackageName,
  prepareCompoundComponents,
  compoundComponentTemplate
} = require('./utils')
const { getTemplate, TemplateToken } = require('./templates/templates')
const { join } = require('path')
const { getPropTypes, getDefaultProps, getProps } = require('./prop.types')

const generateTypings = outputDir => async tags => {
  const distTs = join(FileName.tempFolder, FileName.tempTsFolder)
  await generateWrappers(distTs, OutputLanguage.TypeScript, false, false)(tags)
  await compileTypescript(distTs)(outputDir)
}

const renderComponent = tag => language => componentName => {
  const compoundsConfig = CompoundComponentsMap[componentName] || {}
  const getCompoundComponents = prepareCompoundComponents(componentName, compoundComponentTemplate, compoundsConfig)
  return getTemplate('react-component', language)
    .replace(TemplateToken.CLASS_JSDOC, renderJsDoc(tag))
    .replace(TemplateToken.IMPORTS, getImportsFromTag(tag).join('\n'))
    .replace(TemplateToken.EVENTS, toJsonObjectsList(getUniqueEvents(tag.events)))
    .replace(TemplateToken.PROPERTIES,
      toJsonObjectsList(
        getProperties(tag)
          .filter(property => property.bindable)
          .map(({ name }) => name))
    )
    .replace(TemplateToken.ATTRIBUTES, '')
    .replace(TemplateToken.PROP_TYPES, getPropTypes(tag).join(',\n'))
    .replace(TemplateToken.PROPS, getProps(tag).join(',\n'))
    .replace(TemplateToken.DEFAULT_PROPS, getDefaultProps(tag).join(',\n'))
    .replace(TemplateToken.TAG_DESCRIPTOR_JSON, JSON.stringify(tag, null, ' '))
    .replace(TemplateToken.COMPOUND_COMPONENTS, getCompoundComponents())
    .replace(TemplateToken.REACT_IMPORT, getCompoundComponents() &&
      'import { createElement } from \'react\'')
    .replace(new RegExp(TemplateToken.COMPONENT_CLASS_NAME, 'g'), componentName)
    .replace(new RegExp(TemplateToken.TAG, 'g'), tag.name)
}

const generateWrappers = (outputDir, language = OutputLanguage.JavaScript, cleanTemp = true, verbose = true) => async (tags) => {
  const indexFileName = getIndexFileName(language)
  const saveIndex = (outputDir, content) => {
    const indexOutputFileName = join(outputDir, indexFileName)
    return outputFile(
      indexOutputFileName,
      content
    )
  }

  const saveStory = async (outputDir, componentName, content) => {
    const indexOutputFileName = join(outputDir, `${componentName}.stories.jsx`)
    const exists = await pathExists(indexOutputFileName)
    return exists || outputFile(
      indexOutputFileName,
      content
    )
  }

  const getStoriesContent = (componentName, tag) =>
    getTemplate('stories', 'js')
      .split(TemplateToken.COMPONENT_CLASS_NAME).join(componentName)

  prepareDir(outputDir, true, verbose)
  const components = []

  for (const tag of tags) {
    const componentName = getComponentName(tag)
    components.push(componentName)
    if (verbose) {
      console.info(`Processing ${componentName}...`)
    }
    tag.events = [...(tag.events || []), ...(ComponentsEventsMap[componentName] || [])]

    const componentOutputDir = join(process.cwd(), outputDir, componentName)
    const storyOutputDir = join(process.cwd(), FileName.storyOutputDir, componentName)
    const componentContent = renderComponent(tag)(language)(componentName)

    await saveIndex(componentOutputDir, componentContent)
    await saveStory(storyOutputDir, componentName, getStoriesContent(componentName, tag))

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
