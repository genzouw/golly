'use strict'

const babelParser = require('@babel/eslint-parser')
const globals = require('globals')
const neostandard = require('neostandard')
const pluginVue = require('eslint-plugin-vue')

module.exports = [
  { ignores: ['build/**', 'config/**', 'dist/**', '**/coverage/**', 'node_modules/**'] },
  // https://github.com/neostandard/neostandard
  ...neostandard({ noJsx: true }),
  // https://eslint.vuejs.org/user-guide/#usage
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.js', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: babelParser
      },
      globals: {
        ...globals.browser
      }
    },
    rules: {
      // 既存コンポーネント名（Top / Create / Show）は単語 1 つ。リネームは本 Issue の範囲外
      'vue/multi-word-component-names': 'off',
      // allow async-await
      'generator-star-spacing': 'off',
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-irregular-whitespace': ['error', { skipStrings: true, skipComments: true, skipRegExps: true, skipTemplates: true }]
    }
  },
  {
    files: ['test/unit/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  }
]
