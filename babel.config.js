module.exports = {
  // ••••••••••••••••••••••••••••••••••
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        modules: false,
        corejs: '3',
        useBuiltIns: 'entry'
      }
    ]
  ],

  // ••••••••••••••••••••••••••••••••••
  plugins: [
    '@babel/plugin-transform-runtime'
  ],

  // ••••••••••••••••••••••••••••••••••
  env: {
    // --------------------------------
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current'
            }
          }
        ]
      ],
      sourceMaps: true,
      retainLines: true
    }
  }
}
