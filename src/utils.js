const { join, parse } = require('path')
const { flowRight, replace, startCase } = require('lodash/fp')
const { access, F_OK, readFileSync, readdirSync, rmdirSync, createWriteStream } = require('fs')
const { copyFileSync, outputFile } = require('fs-extra')
const mkdirp = require('mkdirp')
const os = require('os')
const { spawnSync, spawn } = require('child_process')
const { WCAConfig, VividRepo, FileName, OutputLanguage } = require('./consts')
const { getTemplate, TemplateToken } = require('./templates/templates')
const { Octokit } = require('@octokit/core')
const { chromium } = require('playwright')
const extract = require('extract-zip')

const renderPropertyJsDoc = property => `* @param ${property.type ? `{${property.type}}` : ''} ${property.name} ${property.description ? `- ${property.description}` : ''}`
const renderTagPropertiesJsDoc = tag => getProperties(tag).map(renderPropertyJsDoc).join('\n')
const renderJsDoc = tag => `/** ${tag.description || ''} \n${renderTagPropertiesJsDoc(tag)}\n*/`
const stripQuotes = input => input.replace(/'/g, '')
const unique = stringArray => Array.from(new Set(stringArray))
const getGithubToken = () => process.env.GITHUB_ACCESS_TOKEN || process.env.GITHUB_TOKEN
const toJsonObjectsList = collection => (collection || []).map(JSON.stringify).join(',')
const toCommaSeparatedList = collection => (collection || []).map(x => `'${stripQuotes(x.name)}'`).join(',')
const capitalize = input => input.replace(/(^|\s)[a-z]/g, s => s.toUpperCase())
const deCapitalize = input => input.replace(/(^|\s)[A-Z]/g, s => s.toLowerCase())
const kebab2Camel = input => deCapitalize(input.split('-').map(x => capitalize(x)).join(''))
const snake2Camel = input => deCapitalize(input.split('_').map(x => capitalize(x)).join(''))
const event2PropName = eventName => `on${capitalize(kebab2Camel(snake2Camel(eventName)))}`
const event2EventDescriptor = eventName => ({ name: eventName, propName: event2PropName(eventName) })
const getFileNameFromDispositionHeader = input => /filename=(.*$)/.exec(input)[1]
const getVividVersionFromFileName = input => /-v(\d*.\d*.\d*)-/.exec(input)[1]
const normalizeVersion = version => version.replace(/[\^~]/g, '')
const isVividPackageName = (packageName) => /@vonage\/vwc-*/.test(packageName)
const getIndexFileName = language => `index.${language === OutputLanguage.TypeScript ? 'tsx' : language}`
const getVividPackageName = componentPath => {
  const { dir } = parse(componentPath)
  if (dir.indexOf('node_modules') >= 0) {
    return /(@vonage\/vwc-.*?)\//.exec(componentPath.replace(/\\/g, '/'))[1]
  }
  const pathParts = dir.split('\\').join('/').split('/')
  if (pathParts.length > 0 && pathParts[pathParts.length - 1] === 'src') {
    pathParts.pop()
  }
  const packageJson = filePath(join(FileName.tempFolder, ...pathParts, FileName.packageJson))
  const pkg = getParsedJson(packageJson)
  return pkg.name
}
const getYarnCommand = () => `yarn${os.platform() === 'win32' ? '.cmd' : ''}`
const prepareDir = (p, clean = true, verbose = true) => {
  if (clean) {
    if (verbose) {
      console.info(`Clearing folder: ${p}`)
    }
    rmdirSync(p, { recursive: true })
  }
  mkdirp.sync(p)
}
const getFirstFolderNameFromPath = path => readdirSync(path, { withFileTypes: true }).find(x => x.isDirectory()).name
const getProperties = tag =>
  (tag.properties || [])
    .filter(prop => prop.type) // only props having certain type
    .filter(prop => /'.*?'/.test(prop.name) ||
      /^([a-zA-Z_$][a-zA-Z\\d_$]*)$/.test(prop.name)) // only props having valid names

const isFileExists = (fileName) => new Promise(
  (resolve, reject) => access(
    filePath(fileName),
    F_OK,
    error => error
      ? reject(error)
      : resolve(fileName)
  ))
const filePath = (fileName) => join(process.cwd(), fileName)

const getParsedJson = (jsonFilePath) => JSON.parse(readFileSync(jsonFilePath, { encoding: 'utf8' }))

const getVividPackageNames = ({ dependencies, devDependencies }) => {
  const deps = {
    ...dependencies,
    ...devDependencies
  }
  const packages = Object.keys(deps).filter(isVividPackageName)
  const vividVersion = packages.length > 0 ? normalizeVersion(deps[packages[0]]) : null // TODO: fetch max version out of all packages
  console.log(`Vivid packages detected from ${FileName.packageJson}: \n${packages.map(x => `  - ${x}`).join('\n')}`)
  return {
    vividPackageNames: packages,
    vividVersion
  }
}

const validateTags = tags => tempFolder => async vividVersion => {
  const indexHtmlFile = filePath(join(tempFolder, FileName.indexHtml))
  outputFile(indexHtmlFile, getTemplate('index', 'html')
    .replace(TemplateToken.VIVID_VERSION, vividVersion)
    .replace(TemplateToken.TAG,
      tags.map(tag => `        <${tag.name}></${tag.name}>`).join('\n')))
  const serveProcess = spawn(
    'node',
    [
      './node_modules/serve/bin/serve.js',
      tempFolder
    ]
  )

  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('http://localhost:5000')
  const tagKeysMap = await page.evaluate(
    () => Array.from(document.body.children)
      .reduce((tagKeysMap, element) => {
        const keys = Object.getOwnPropertyNames(element).map(x => x.replace(/_/g, ''))
        tagKeysMap[element.tagName.toLowerCase()] = keys
        return tagKeysMap
      }, {})
  )
  await browser.close()

  serveProcess.kill()
  return tags.map(tag => {
    if (tag.properties) {
      tag.properties = tag.properties.filter(property => tagKeysMap[tag.name].includes(property.name))
    }
    return tag
  })
}

const getCustomElementTagsDefinitionsList = (config = WCAConfig) => ({ vividPackageNames, vividVersion }) => new Promise((resolve) => {
  const analyzerOutput = filePath(join(config.tempFolder, config.tempFileName))
  console.log(`Analyzing Vivid v${vividVersion} elements...`)
  const child = spawnSync(
    'node',
    config.nodeArgumentsFactory(vividPackageNames, analyzerOutput),
    { cwd: process.cwd() }
  )
  if (child.status === 0) {
    const output = getParsedJson(analyzerOutput)
    const uniqueTags = unique(output.tags.map(x => x.name)).map(x => output.tags.find(y => y.name === x))
    validateTags(uniqueTags)(config.tempFolder)(vividVersion).then(tags => resolve(tags))
  }
})

const compileTypescript = (rootDir) => async (outDir) =>
  spawnSync(
    'node',
    [
      './node_modules/typescript/lib/tsc.js',
      '--project',
      filePath('tsconfig.json'),
      '--rootDir',
      rootDir,
      '--outDir',
      outDir
    ]
  )

const copyStaticAssets = (outputDir, assets) => () => {
  const cp = file => {
    const source = filePath(file)
    const dest = filePath(join(outputDir, file))
    copyFileSync(source, dest)
    console.info(`Copy static asset ${source} => ${dest}`)
  }
  assets.split(',').map(assetFileName => cp(assetFileName))
}

const getInputArgument = (argumentName, defaultValue = null) => {
  const argumentObjects = process.argv
    .filter(argument => argument.indexOf('=') >= 0)
    .map(argument => ({
      name: argument.split('=')[0].replace(/--/g, ''),
      value: argument.split('=')[1]
    }))
  const targetArgument = argumentObjects.find(argumentObject => argumentObject.name === argumentName)
  return targetArgument ? targetArgument.value : defaultValue
}

const getVividLatestRelease = async (config = { tempFolder: FileName.tempFolder, tempFileName: FileName.tempVividZipball }) => {
  const outFolder = filePath(config.tempFolder)
  prepareDir(outFolder, false)
  console.log('Fetching latest Vivid release artifact...')
  if (!getGithubToken()) {
    console.warn('It seems GITHUB_ACCESS_TOKEN or GITHUB_TOKEN environment variable is not defined.')
    return
  }
  const octokit = new Octokit({ auth: getGithubToken() })
  const result = await octokit.request(`GET /repos/${VividRepo}/zipball`)
  if (result.status === 200) {
    const filename = getFileNameFromDispositionHeader(result.headers['content-disposition'])
    console.info(`Got zipball ${filename}`)
    return new Promise((resolve, reject) => {
      const vividZipFileName = join(outFolder, config.tempFileName)
      const vividZipStream = createWriteStream(vividZipFileName)
      vividZipStream.write(Buffer.from(result.data), async () => {
        try {
          await extract(vividZipFileName, { dir: outFolder })
        } catch (err) {
          console.error(err)
          reject(err)
        }
        const vividFolder = join(outFolder, getFirstFolderNameFromPath(outFolder))
        console.log(`Installing Vivid packages at: ${vividFolder}...`)
        const child = spawnSync(getYarnCommand(), [], { cwd: vividFolder, stdio: 'ignore' })
        if (child.status === 0) {
          resolve({
            vividPackageNames: `${vividFolder}/**/components/**`,
            vividVersion: getVividVersionFromFileName(filename)
          })
        }
        resolve()
      })
    })
  }
}

const getComponentNameFromPackage = flowRight(
  replace(' ', ''),
  startCase,
  replace('@vonage/', '')
)

module.exports = {
  toCommaSeparatedList,
  toJsonObjectsList,
  compileTypescript,
  filePath,
  prepareDir,
  renderJsDoc,
  capitalize,
  kebab2Camel,
  event2PropName,
  event2EventDescriptor,
  getComponentNameFromPackage,
  getInputArgument,
  isFileExists,
  isVividPackageName,
  copyStaticAssets,
  getIndexFileName,
  getProperties,
  getParsedJson,
  getVividPackageName,
  getVividPackageNames,
  getVividLatestRelease,
  getCustomElementTagsDefinitionsList
}
