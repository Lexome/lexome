import { Prisma } from "@prisma/client"
import { convertObjectPropertiesToCamelCase } from "../../utils"
import { prismaClient } from "../prismaClient"

export const resolvers = {
  Query: {
    getBooks: async (parent, args) => {
      const { query, authorId, pagination } = args

      const conditions: Prisma.bookWhereInput[] = []

      if (query) {
        conditions.push({
          title: { contains: query, mode: 'insensitive'}
        })
      }

      if (authorId) {
        conditions.push({
          authors: {
            some: {
              id: authorId
            }
          }
        })
      }

      const limit = pagination?.limit || 50
      const offset = pagination?.offset || 0

      const books = await prismaClient.book.findMany({
        where: conditions ? {
          AND: conditions
        } : undefined,
        skip: offset,
        take: limit + 1,
      })

       const renderedBooks = books.map(convertObjectPropertiesToCamelCase).slice(0, limit)

      return {
        records: renderedBooks.slice(0, limit),
        pageInfo: {
          hasMore: books.length > limit,
          offset
        }
      }
    },

    getBook: async (parent, { id }) => {
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
  },

  Book: {
    authors: async (parent) => {
      const { id } = parent

      const book = await prismaClient.book.findUnique({
        where: { id },
        include: {
          authors: true
        }
      }) 

      return book?.authors.map(convertObjectPropertiesToCamelCase) || []

      // const authors = await loaders.authorsForBookLoader.load(id)



      // return authors.map(convertObjectPropertiesToCamelCase)
    },

    genres: async (parent) => {
      const { id } = parent
      const genres = await prismaClient.genre.findMany({
        where: {
          books: {
            some: {
              id
            }
          }
        }
      })

      return genres.map(convertObjectPropertiesToCamelCase)
    },

    enhancements: async (parent) => {
      const { id } = parent
      const enhancements = await prismaClient.enhancement.findMany({
        where: {
          book_id: id
        }
      })

      return enhancements.map(convertObjectPropertiesToCamelCase)
    }
  }
}