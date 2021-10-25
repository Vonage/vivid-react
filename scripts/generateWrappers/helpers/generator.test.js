const { posix, win32 } = require('path')
const { getImportsFromTag } = require('./generator')

describe('getImportsFromTag', () => {
  const mainComponentTag = {
    name: 'vwc-list',
    path: './../node_modules/@vonage/vwc-list/src/vwc-list.ts'
  }

  const subComponentTag = {
    name: 'vwc-radio-list-item',
    path: './../node_modules/@vonage/vwc-list/src/vwc-radio-list-item.ts'
  }

  it('should create a default import for main component', () => {
    const result = getImportsFromTag(mainComponentTag)

    expect(result).toEqual([`import '@vonage/vwc-list'`])
  })

  it('should create import from specific file for subcomponent and main component import', () => {
    const result = getImportsFromTag(subComponentTag)

    expect(result).toEqual([
      `import '@vonage/vwc-list'`,
      `import '@vonage/vwc-list/${subComponentTag.name}'`
    ])
  })

  it('should work for win32 paths', () => {
    const winTag = {
      ...subComponentTag,
      path: subComponentTag.path.split(posix.sep).join(win32.sep)
    }

    const result = getImportsFromTag(winTag)

    expect(result).toEqual([
      `import '@vonage/vwc-list'`,
      `import '@vonage/vwc-list/${subComponentTag.name}'`
    ])
  })
})
