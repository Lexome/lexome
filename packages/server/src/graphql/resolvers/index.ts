
const { merge } = require('lodash')

// Import the resolvers from each module
import { resolvers as booksResolvers } from './books'
import { resolvers as authorsResolvers } from './authors'

// Merge them together
export const resolvers = merge(
  booksResolvers,
  authorsResolvers,
)