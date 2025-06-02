// eslint.config.mjs
import eslintJs from '@eslint/js'
import globals from 'globals'

const { configs } = eslintJs
const { browser } = globals

export default [
    {
        ignores: ['proto/*'],
        files: ['**/*.{mjs,cjs}'],
        ...configs.recommended,
        languageOptions: {
            ...configs.recommended.languageOptions,
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...configs.recommended.languageOptions?.globals,
                ...browser
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                    experimentalObjectRestSpread: true
                }
            }
        },
        rules: {
            'array-element-newline': ['error', 'never'],
            'space-before-function-paren': [
                'error', {
                    anonymous: 'always',
                    named: 'never',
                    asyncArrow: 'always'
                }
            ],
            indent: ['error', 4, { SwitchCase: 1 }],
            semi: ['error', 'never']
        }
    }
]
