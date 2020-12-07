const { posix, win32 } = require('path')

module.exports.getImportPathFromTag = ({ name, path }) => {
  const normalizedPath = path.split(win32.sep).join(posix.sep)
  const [, rootComponent] = /@vonage\/([\w-]+)\//g.exec(normalizedPath)
  return rootComponent === name ? `@vonage/${name}` : `@vonage/${rootComponent}/${name}`
}
