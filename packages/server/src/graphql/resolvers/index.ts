
const { merge } = require('lodash')

// Import the resolvers from each module
import { resolvers as queryResolvers } from './Query'

// Merge them together
export const resolvers = merge(
  booksResolvers
)