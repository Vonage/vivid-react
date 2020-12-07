import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import autoExternal from 'rollup-plugin-auto-external'
import resolve from '@rollup/plugin-node-resolve'

const OUTPUT_DIR = './dist'

export default {
  input: 'src/index.js',
  output: [
    {
      file: `${OUTPUT_DIR}/index.js`,
      format: 'cjs',
      exports: 'auto'
    }
  ],
  plugins: [
    resolve({
      extensions: ['.js', '.json', '.node']
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: /node_modules/
    }),
    commonjs({
      include: /node_modules/
    }),
    autoExternal()
  ]
}
