const { join, parse } = require('path'),
    { access, F_OK, readFileSync, readdirSync, rmdirSync, createWriteStream } = require('fs'),
    mkdirp = require('mkdirp'),
    os = require('os'),
    { spawnSync } = require('child_process'),
    { WCAConfig, tempFolder } = require('./consts'),
    { Octokit } = require('@octokit/core'),
    extract = require('extract-zip')

const stripQuotes = input => input.replace(/\'/g, '')
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
const isVividPackageName = (packageName) => /@vonage\/vwc-*/.test(packageName)
const getVividPackageName = componentPath => {
    const { dir } = parse(componentPath)
    if (dir.indexOf('node_modules') >= 0 ) {
        return /(@vonage\/vwc-.*?)\//.exec(componentPath.replace(/\\/g, '/'))[1]
    }
    const pathParts = dir.split('\\').join('/').split('/')
    if (pathParts.length > 0 && pathParts[pathParts.length - 1] == 'src') {
        pathParts.pop()
    }    
    const packageJson = filePath(join(tempFolder, ...pathParts, 'package.json'))
    const pkg = getParsedJson(packageJson)
    return pkg.name
}
const getYarnCommand = () => os.platform() === 'win32' ? 'yarn.cmd' : 'yarn'
const cleanupDir = p => {
    console.info(`Clearing folder: ${p}`)
    rmdirSync(p, { recursive: true })
    mkdirp.sync(p)
}
const getFirstFolderNameFromPath = path => readdirSync(path, {withFileTypes: true}).find(x => x.isDirectory()).name

const isFileExists = (fileName) => new Promise(
    (resolve, reject) => access(
        filePath(fileName),
        F_OK,
        error => error
            ? reject(false)
            : resolve(fileName)
    ))
const filePath = (fileName) => join(process.cwd(), fileName)

const getParsedJson = (jsonFilePath) => JSON.parse(readFileSync(jsonFilePath, { encoding: 'utf8' }))

const getVividPackageNames = ({ dependencies, devDependencies }) => {
    const unique = (stringArray) => Array.from(new Set(stringArray))
    const packages = [
        ...Object.keys(dependencies),
        ...Object.keys(devDependencies)
    ]
    const result = unique(packages).filter(isVividPackageName)
    console.log(`Vivid packages detected from package.json: \n${result.map(x => `  - ${x}`).join('\n')}`)
    return result
}

const getCustomElementTagsDefinitionsList = (config = WCAConfig) => (vividPackageNames) => new Promise((resolve) => {
    const analyzerOutput = filePath(join(config.tempFolder, config.tempFileName))
    const child = spawnSync(
        'node',
        config.nodeArgumentsFactory(vividPackageNames, analyzerOutput),
        { cwd: process.cwd() }
    )
    if (child.status === 0) {
        const output = getParsedJson(analyzerOutput)
        cleanupDir(filePath(config.tempFolder))
        return resolve(output.tags)
    }
})

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

const getVividLatestRelease = async (config = { tempFolder, tempFileName: 'vivid.zip' }) => {
    const outFolder = filePath(config.tempFolder)
    cleanupDir(outFolder)
    console.log(`Fetching latest Vivid release artifact...`)
    if (!getGithubToken()) {
        console.warn(`It seems GITHUB_ACCESS_TOKEN or GITHUB_TOKEN environment variable is not defined.`)
        return
    }
    const octokit = new Octokit({ auth: getGithubToken() })
    const result = await octokit.request('GET /repos/Vonage/vivid/zipball')
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
                    console.log('Analyzing Vivid elements...')
                    resolve(`${vividFolder}/**/components/**`)
                }
                resolve()
            })
        })
    }
}

module.exports = {
    toCommaSeparatedList,
    toJsonObjectsList,
    cleanupDir,
    capitalize,
    kebab2Camel,
    event2PropName,
    event2EventDescriptor,
    getInputArgument,
    isFileExists,
    getParsedJson,
    getVividPackageName,
    getVividPackageNames,
    getVividLatestRelease,
    getCustomElementTagsDefinitionsList
}