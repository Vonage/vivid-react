const { copyFileSync } = require('fs-extra')
const { join } = require('path')
const { filePath } = require('./../src/utils')
const { PACKAGE_JSON } = require('./../src/consts')

const cp2dist = file => copyFileSync(filePath(file), filePath(join('dist', file)))

cp2dist(PACKAGE_JSON)
cp2dist('README.md')
cp2dist('SUPPORTED_COMPONENTS.md')
