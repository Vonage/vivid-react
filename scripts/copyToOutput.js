const { copyFileSync } = require('fs-extra')
const { join } = require('path')
const { filePath } = require('../src/utils')
const { FileName } = require('../src/consts')

const cp = file => copyFileSync(filePath(file), filePath(join(FileName.defaultOutputDirectory, file)))

cp(FileName.packageJson)
cp(FileName.readme)
cp(FileName.supportedComponents)
