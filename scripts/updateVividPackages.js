const ora = require('ora')
const { EOL } = require('os')
const { spawn } = require('child_process')
const { dependencies } = require('../package.json')

const spinner = ora()

const IGNORED_PACKAGES = [
  '@vonage/vwc-angular-forms'
]

const spawnPromise = (...args) => new Promise((resolve, reject) => {
  const cmd = spawn(...args)
  const stdout = []
  const stderr = []
  cmd.stdout.on('data', (data) => stdout.push(data))
  cmd.stderr.on('data', (data) => stderr.push(data))
  cmd.on('close', (status) => status ? reject(stderr.join('')) : resolve(stdout.join('')))
  cmd.on('error', () => reject(stderr.join('')))
})

const keepOnlyWebComponents = ({ name }) => !IGNORED_PACKAGES.includes(name)

const keepOnlyChangedPackages = ({ name, version }) => dependencies[name] !== `^${version}`

const getLatestPackages = async (pattern = 'vonage/vwc') => {
  spinner.start(`Searching for '${pattern}' packages`)
  try {
    const stdout = await spawnPromise('npm', ['search', pattern, '--json', '--no-description'], { encoding: 'utf8' })
    spinner.succeed()
    return JSON.parse(stdout).filter(keepOnlyWebComponents)
  } catch {
    spinner.fail('Failed to grab the list of packages from `npm`')
    return []
  }
}

const updatePackageJson = async () => {
  const packages = await getLatestPackages()
  const packagesToUpdate = packages.filter(keepOnlyChangedPackages)
  spinner.info(`Found ${packagesToUpdate.length} packages to update`)
  let updated = 0
  for (const { name, version } of packagesToUpdate) {
    const versionedPackage = `${name}@${version}`
    spinner.start(`Updating '${versionedPackage}' from '${dependencies[name]}'`)
    try {
      await spawnPromise('yarn', ['add', versionedPackage], { encoding: 'utf8' })
      updated++
      spinner.succeed()
    } catch (errorMessage) {
      spinner.fail()
      spinner.fail(errorMessage.trim(EOL))
    }
  }
  console.log(`Updated ${updated} of ${packagesToUpdate.length}`)
}

updatePackageJson()
