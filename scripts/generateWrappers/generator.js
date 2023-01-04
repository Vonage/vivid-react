const packageJson = require('../../package.json')
const { getImportsFromTag } = require('./helpers/generator')
const {
  ComponentsEventsMap,
  ComponentsEventsMapV3,
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
  event2PropName,
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
const { getPropTypes, getDefaultProps, getProps, mapType } = require('./prop.types')

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

const renderComponentV3 = prefix => classDeclaration => language => componentClassName => {
  const componentPrefix = prefix
  const componentName = classDeclaration.name
  const componentTagName = `${componentPrefix}-${camel2kebab(componentName)}`
  const events = [...(classDeclaration.events?.map(({ name }) => name) || []), ...(ComponentsEventsMapV3[componentClassName] || [])]
  const properties = classDeclaration.members?.filter(({ privacy = 'public', kind, readonly }) => kind === 'field' && privacy === 'public' && readonly !== true) || []
  const attributes = classDeclaration.attributes?.filter(({ fieldName }) => properties.find(({ name }) => fieldName === name)) || []
  const propertyNames = properties.map(({ name }) => `'${name}'`)
  const props = [
    ...(events.map(x => x.propName || event2PropName(x.name || x)).map(x => `  ${x}?: (event: SyntheticEvent) => void`)),
    ...(properties.map(({ name, type }) => `  ${name}?: ${mapType(type?.text)}`))
  ]
  const renderPropertyJsDoc = ({ type, name, attribute = null, description }) => `* @param ${type?.text ? `{${type?.text}}` : ''} ${name} ${description ? `- ${description}` : ''} ${attribute ? `**attribute** \`${attribute.name || attribute.fieldName}\`` : ''}`
  const jsDoc = `/** ${classDeclaration.description || componentClassName} \n${properties.map((p) => ({ ...p, attribute: attributes.find(({ fieldName }) => fieldName === p.name) })).map(renderPropertyJsDoc).join('\n')}\n*/`

  return getTemplate('react-component-v3', language)
    .replace(TemplateToken.CLASS_JSDOC, jsDoc)
    .replace(TemplateToken.ATTRIBUTES, '')
    .replace(TemplateToken.PROP_TYPES, '')
    .replace(TemplateToken.PROPS, props.join(',\n'))
    .replace(TemplateToken.TAG_DESCRIPTOR_JSON, JSON.stringify(classDeclaration, null, ' '))
    .replace(new RegExp(TemplateToken.COMPONENT_CLASS_NAME, 'g'), componentClassName)
    .replace(new RegExp(TemplateToken.TAG_PREFIX, 'g'), componentPrefix)
    .replace(new RegExp(TemplateToken.COMPONENT_NAME, 'g'), componentName)
    .replace(new RegExp(TemplateToken.TAG, 'g'), componentTagName)
    .replace(new RegExp(TemplateToken.EVENTS, 'g'), toJsonObjectsList(getUniqueEvents(events)))
    .replace(new RegExp(TemplateToken.PROPERTIES, 'g'), propertyNames.join(', '))
}

/**
 * Generates Vivid 3.x wrappers
 */
const generateWrappersV3 = (outputDir, language = OutputLanguage.JavaScript, cleanTemp = true, verbose = true) => async (meta) => {
  const componentPrefix = 'vvd'
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
    const componentNameKebab = camel2kebab(classDeclaration.name)
    const componentOutputDir = join(process.cwd(), outDir, componentName)
    const componentContent = renderComponentV3(componentPrefix)(classDeclaration)(language)(componentName)
    await saveIndex(componentOutputDir, componentContent)

    const packageName = '@vonage/vivid'
    const packageJsonContent = {
      name: `@vonage/vivid-react-${componentPrefix}-${componentNameKebab}`,
      version: packageJson.dependencies[packageName],
      main: indexFileName,
      types: 'index.d.ts',
      private: true,
      license: 'MIT',
      dependencies: {
        [packageName]: packageJson.dependencies[packageName]
      }
    }
    await outputJson(join(componentOutputDir, FileName.packageJson), packageJsonContent, { spaces: 2 })

    if (verbose) {
      console.info(`${componentName}... v3`)
    }
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
