const { cleanupDir, kebab2Camel, capitalize, toCommaSeparatedList, toJsonObjectsList, event2EventDescriptor } = require('./utils')
const { getTemplate, TemplateToken } = require('./templates/templates')
const { writeFileSync } = require('fs')
const { join } = require('path')
const { OutputLanguage } = require('./consts')
const { getPropTypes, getDefaultProps, getProps } = require('./prop.types')

const renderComponent = tag => language => componentName => {
    const flatEventsList = (tag.events || []).map(x => (typeof x === 'string' ? x : x.name ))
    const result = getTemplate('react-component', language)
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

const generateWrappers = (outputDir, language = OutputLanguage.JavaScript) => (tags) => {
    cleanupDir(outputDir)
    const imports = []
    const exports = []

    for (const tag of tags) {
        const camelizedName = kebab2Camel(tag.name)
        const componentName = capitalize(camelizedName)
        const componentFileExt = `.${language === OutputLanguage.TypeScript ? 'tsx' : language}`
        const componentFileName = `${camelizedName}.g`
        const componentOutputFileName = join(process.cwd(), outputDir, `${componentFileName}${componentFileExt}`)
        imports.push(`import { ${componentName} } from './${componentFileName}'`)
        exports.push(`  ${componentName}`)
        console.info(`Processing ${componentName}...`)

        writeFileSync(
            componentOutputFileName,
            renderComponent(tag)(language)(componentName)
        )
    }

    const indexOutputFileName = join(process.cwd(), outputDir, `index.${language}`)
    writeFileSync(
        indexOutputFileName,
        getTemplate('index', language)
            .replace(TemplateToken.EXPORTS, exports.join(',\n'))
            .replace(TemplateToken.IMPORTS, imports.join('\n'))
    )
    console.info(`${imports.length} wrappers generated at ${outputDir}`)
}

module.exports = {
    generateWrappers
}
