import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://127.0.0.1:4000',
  documents: ['src/hooks/data/*.ts'],
  generates: {
    'gql/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false
      }
    }
  }
}

export default config