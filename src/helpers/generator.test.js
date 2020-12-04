const { posix, win32 } = require('path')
const { getImportPathFromTag } = require('./generator')

describe('getImportPathFromTag', () => {
  const mainComponentTag = {
    name: 'vwc-list',
    path: './../node_modules/@vonage/vwc-list/src/vwc-list.ts'
  }

  const subComponentTag = {
    name: 'vwc-radio-list-item',
    path: './../node_modules/@vonage/vwc-list/src/vwc-radio-list-item.ts'
  }

  it('should create a default import for main component', () => {
    const result = getImportPathFromTag(mainComponentTag)

    expect(result).toEqual('@vonage/vwc-list')
  })

  it('should create import from specific file for subcomponent', () => {
    const result = getImportPathFromTag(subComponentTag)

    expect(result).toEqual(`@vonage/vwc-list/${subComponentTag.name}`)
  })

  it('should work for win32 paths', () => {
    const winTag = {
      ...subComponentTag,
      path: subComponentTag.path.split(posix.sep).join(win32.sep)
    }

    const result = getImportPathFromTag(winTag)

    expect(result).toEqual(`@vonage/vwc-list/${subComponentTag.name}`)
  })
})
