import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
// import pkg from './package.json'

export default {
  input: 'index.jsx',
  output: {
    file: 'bundle.js',
    format: 'cjs',
  },
  plugins: [
    external(),
    postcss({
      modules: true,
    }),
    resolve(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react']
    }),
    commonjs(),
    terser(),
  ],
}
