const { spawnSync } = require('child_process')

const IGNORED_PACKAGES = [
  '@vonage/vwc-angular-forms'
]

const keepOnlyWebComponents = ({ name }) => !IGNORED_PACKAGES.includes(name)

const mapPackagesToYarnArgs = (packages) => packages.map(({ name, version }) => `${name}@${version}`)

const getLatestPackages = (pattern = 'vonage/vwc') => {
  console.log(`Searching for '${pattern}' packages`)
  try {
    const { stdout } = spawnSync('npm', ['search', pattern, '--json', '--no-description'], { encoding: 'utf8' })
    return JSON.parse(stdout).filter(keepOnlyWebComponents)
  } catch {
    console.error('Failed to grab the list of packages from `npm`')
    return []
  }
}

const updatePackageJson = () => {
  const packages = getLatestPackages()
  console.log(`Found ${packages.length} packages`)
  if (packages.length) {
    console.log('Running `yarn` to update `package.json` with latest packages')
    spawnSync('yarn', ['add', ...mapPackagesToYarnArgs(packages)], { encoding: 'utf8' })
    console.log('Done')
  } else {
    console.log('No packages provided to update in `package.json`')
  }
}

updatePackageJson()
