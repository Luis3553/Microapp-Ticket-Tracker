//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    // Ignore local config files that aren't part of the TS project
    ignores: ['eslint.config.js', 'prettier.config.js'],
  },
]
