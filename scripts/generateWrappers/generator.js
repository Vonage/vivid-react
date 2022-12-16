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
  camel2kebab,
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

const generateTypingsV3 = outputDir => async meta => {
  const distTs = join(FileName.tempFolder, FileName.tempTsFolder)
  await generateWrappersV3(distTs, OutputLanguage.TypeScript, false, false)(meta)
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

/**
 * Generates Vivid 2.x wrappers
 */
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
    getTemplate('stories', OutputLanguage.JavaScript)
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
    const storyOutputDir = join(process.cwd(), FileName.storyOutputDir, 'v2', componentName)
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

const renderComponentV3 = classDeclaration => language => componentClassName => {
  const componentName = classDeclaration.name
  const componentNameKebab = camel2kebab(componentName)
  return getTemplate('react-component-v3', language)
    .replace(TemplateToken.ATTRIBUTES, '')
    .replace(TemplateToken.PROP_TYPES, '')
    .replace(TemplateToken.PROPS, '')
    .replace(TemplateToken.TAG_DESCRIPTOR_JSON, JSON.stringify(classDeclaration, null, ' '))
    .replace(new RegExp(TemplateToken.COMPONENT_CLASS_NAME, 'g'), componentClassName)
    .replace(new RegExp(TemplateToken.COMPONENT_NAME, 'g'), componentName)
    .replace(new RegExp(TemplateToken.COMPONENT_NAME_KEBAB, 'g'), componentNameKebab)
    .replace(new RegExp(TemplateToken.EVENTS, 'g'), '')
    .replace(new RegExp(TemplateToken.PROPERTIES, 'g'), '')
}

/**
 * Generates Vivid 3.x wrappers
 */
const generateWrappersV3 = (outputDir, language = OutputLanguage.JavaScript, cleanTemp = true, verbose = true) => async (meta) => {
  const indexFileName = getIndexFileName(language)
  const saveIndex = (outputDir, content) => {
    const indexOutputFileName = join(outputDir, indexFileName)
    return outputFile(
      indexOutputFileName,
      content
    )
  }

  const outDir = `${outputDir}/v3`

  const classDeclarations = meta.elements.modules.reduce((acc, { declarations }) =>
    [...acc, ...declarations.filter(({ kind }) => kind === 'class')]
    , [])

  for (const classDeclaration of classDeclarations) {
    const componentName = `Vwc${classDeclaration.name}`
    const componentOutputDir = join(process.cwd(), outDir, componentName)
    const componentContent = renderComponentV3(classDeclaration)(language)(componentName)
    await saveIndex(componentOutputDir, componentContent)
  }

  if (language === OutputLanguage.JavaScript) {
    await generateTypingsV3(outputDir)(meta)
  }

  prepareDir(filePath(FileName.tempFolder), cleanTemp, verbose)
}

module.exports = {
  generateWrappers,
  generateWrappersV3
}
