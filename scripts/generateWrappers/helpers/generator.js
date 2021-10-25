const { posix, win32 } = require('path')

module.exports.getImportsFromTag = ({ name, path }) => {
  const normalizedPath = path.split(win32.sep).join(posix.sep)
  const [, rootComponent] = /@vonage\/([\w-]+)\//g.exec(normalizedPath)
  const result = []
  if (rootComponent === name) {
    result.push(`@vonage/${name}`)
  } else {
    result.push(`@vonage/${rootComponent}`)
    result.push(`@vonage/${rootComponent}/${name}`)
  }
  return result.map(x => `import '${x}'`)
}
