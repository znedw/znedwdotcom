import { defineConfig, globalIgnores } from 'eslint/config'
import { fixupConfigRules } from '@eslint/compat'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'

const nextConfig = fixupConfigRules(nextVitals).map((config) => {
  if (config.languageOptions?.parser?.meta?.name !== 'eslint-config-next/parser') {
    return config
  }

  // Use ESLint's default parser because Next's bundled parser is not ESLint 10-compatible.
  const languageOptions = { ...config.languageOptions }
  delete languageOptions.parser
  languageOptions.parserOptions = {
    ...languageOptions.parserOptions,
    ecmaFeatures: {
      ...languageOptions.parserOptions?.ecmaFeatures,
      jsx: true,
    },
  }

  return { ...config, languageOptions }
})

const eslintConfig = defineConfig([
  ...nextConfig,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig