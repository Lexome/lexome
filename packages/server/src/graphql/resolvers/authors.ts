import { create } from "domain"
import { convertObjectPropertiesToCamelCase } from "../../utils"
import { prismaClient } from "../prismaClient"
import { createHash } from "crypto"

export const resolvers = {
  Query: {
    getAuthors: async (_, { query, pagination }) => {
      try {
        const offset = pagination?.offset || 0
        const limit = pagination?.limit || 50

        const authors = await prismaClient.author.findMany({
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
        console.log('here!')
        console.error(e)

        return []
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
      const author = await prismaClient.author.create({
        data: {
          display_name: args.displayName,
        },
      })

      return convertObjectPropertiesToCamelCase(author)
    }
  }
}