import { create } from "domain"
import { convertObjectPropertiesToCamelCase } from "../../utils"
import { prismaClient } from "../prismaClient"
import { createHash } from "crypto"

export const resolvers = {
  Query: {
    getAuthors: async (parent, { query, pagination }) => {
      try {
        const authors = await prismaClient.author.findMany({
          where: query ? {
            OR: [{
              display_name: { contains: query },
              user: {
                display_name: { contains: query },
              },
            }],
          } : undefined,
          skip: pagination?.offset || 0,
          take: pagination?.limit || 10,
        })

        console.log('authors', authors)

        return authors.map(convertObjectPropertiesToCamelCase)
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