import { convertObjectPropertiesToCamelCase } from "../../utils"
import { prismaClient } from "../prismaClient"

export const resolvers = {
  Query: {
    getBooks: async (parent, args, { models }) => {
      const { title, authorId, pagination } = args

      const where = {
        OR: [
          { title: { contains: title } },
          { authorId },
        ],
      }

      const books = await prismaClient.book.findMany({
        where,
        skip: pagination?.offset || 0,
        take: pagination?.limit || 10,
      })

      return books.map(convertObjectPropertiesToCamelCase)
    },

    getBook: async (parent, { id }, { models }) => {
      const book = await prismaClient.book.findUnique({
        where: { id },
      })

      return convertObjectPropertiesToCamelCase(book)
    }
  },

  Mutation: {
    createBook: async (parent, args: {
      title,
      description,
      coverUrl,
      assetUrl,
      authors: string[],
      genres: string[],

    }) => {
      const book = await prismaClient.book.create({
        data: {
          title: args.title,
          description: args.description,
          cover_url: args.coverUrl,
          asset_url: args.assetUrl,
          authors: {
            connect: args.authors.map((id: string) => ({ id })),
          },
          genres: {
            connect: args.genres.map((id: string) => ({ id })),
          },
        },
      })

      return convertObjectPropertiesToCamelCase(book)
    },
  }
}