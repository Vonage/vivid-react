const { posix, win32 } = require('path')

const rootImportExclusions = ['vwc-tags']

module.exports.getImportsFromTag = ({ name, path }) => {
  const normalizedPath = path.split(win32.sep).join(posix.sep)
  const [, rootComponent] = /@vonage\/([\w-]+)\//g.exec(normalizedPath)
  const result = []
  if (rootComponent === name) {
    result.push(`@vonage/${name}`)
  } else {
    if (rootImportExclusions.indexOf(rootComponent) < 0) {
      result.push(`@vonage/${rootComponent}`)
    }
    result.push(`@vonage/${rootComponent}/${name}`)
  }
  return result.map(x => `import '${x}'`)
}
