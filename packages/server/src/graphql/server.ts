import { resolvers } from './resolvers';
import fs from 'fs'
import { ApolloServer } from '@apollo/server';

// Read types from types.gql file
const typeDefs = fs.readFileSync('src/graphql/types.gql', 'utf8')

export const server = new ApolloServer({
  typeDefs,
  resolvers,
});

