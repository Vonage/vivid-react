const os = require('os')
const { getComponentNameFromPackage } = require('../src/utils')
const { outputFile } = require('fs-extra')

const { isVividPackageName } = require('../src/utils')
const { dependencies, devDependencies } = require('../package.json')

const generateSupportedComponents = () => {
  const allDeps = Object.entries({
    ...devDependencies,
    ...dependencies,
  })

  const reducePackagesToVividComponentsList = (acc, [name, version]) => {
    if (!isVividPackageName(name)) {
      return acc
    }
    const componentName = getComponentNameFromPackage(name)
    return [...acc, `| ${componentName} | ${name} | ${version} |`]
  }

  return allDeps.reduce(
    reducePackagesToVividComponentsList,
    [
      '# Components list',
      'The wrapper supports following components generated from `vivid` packages',
      '',
      '| Component Name | Package Name | Package Version |',
      '|----------------|--------------|-----------------|'
    ]
  )
}

const updateSupportedComponents = async (target) => {
  const packageList = generateSupportedComponents()
  await outputFile(target, packageList.join(os.EOL))
}

updateSupportedComponents('docs/SUPPORTED_COMPONENTS.md')
