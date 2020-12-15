import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import packageJson from './package.json';

const { name, version } = packageJson;
const shortName = name.split('/').pop()
const banner = `/* ${name} version ${version} (original by myron.liu) */`;
const plugins = [
  postcss({ extensions: ['.less'], extract: `dist/${shortName}.css` }),
  resolve({ jsnext: true, main: true, browser: true }),
  commonjs({
    include: 'node_modules/**',
    namedExports: {
      'node_modules/body-scroll-lock/lib/bodyScrollLock.min.js': ['disableBodyScroll', 'enableBodyScroll', 'clearAllBodyScrollLocks']
    }
  }),
  babel({
    babelrc: false,
    include: 'src/**/*.js',
    runtimeHelpers: true,
    presets: [
      [
        'env',
        {
          modules: false
        }
      ],
      'stage-2',
      'es2015-rollup'
    ]
  }),
  replace({
    __VERSION__: version
  })
];

export default [{
  input: 'src/index.js',
  output: [{
    banner,
    file: `dist/${shortName}.common.js`,
    format: 'cjs'
  }, {
    banner,
    file: `dist/${shortName}.esm.js`,
    format: 'es'
  }],
  plugins: plugins,
  external: ['vue']
}, {
  input: 'src/index.js',
  output: {
    file: `dist/${shortName}.js`,
    format: 'umd',
    name: 'MuseUI',
    globals: {
      vue: 'Vue'
    }
  },
  plugins: [
    ...plugins,
    uglify()
  ],
  external: ['vue']
}];
