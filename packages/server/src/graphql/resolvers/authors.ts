import { convertObjectPropertiesToCamelCase } from "../../utils"
import { prisma } from "../../prisma"
import { Resolvers } from '../../generated/graphql'

export const resolvers: Resolvers = {
  Query: {
    getAuthors: async (_, { query, pagination }) => {
      try {
        const offset = pagination?.offset || 0
        const limit = pagination?.limit || 50

        const authors = await prisma.author.findMany({
          where: query ? {
            OR: [{
              display_name: { contains: query },
              user: {
                display_name: { contains: query },
              },
            }],
          } : undefined,
          skip: offset,
          take: limit + 1,
        })

        const records = authors.map(convertObjectPropertiesToCamelCase).slice(0, limit)

        return {
          records,
          pageInfo: {
            hasMore: authors.length > limit,
            offset
          }
        }
      } catch (e) {
        throw e 
      }
    },

    getAuthor: async (parent, { id }, { models }) => {
      const author = await models.author.findUnique({
        where: {
          id
        },
      })

      return convertObjectPropertiesToCamelCase(author)
    }
  },

  Mutation: {
    createAuthor: async (parent, args) => {
      const author = await prisma.author.create({
        data: {
          display_name: args.displayName,
        },
      })

      return convertObjectPropertiesToCamelCase(author)
    }
  },

  Author: {
    books: async (parent) => {
      const { id: authorId } = parent

      const author = await prisma.author.findUnique({
        where: {
          id: authorId
        },
        include: {
          books: true 
        }
      })

      return author?.books.map(convertObjectPropertiesToCamelCase) || []
    }
  },
}