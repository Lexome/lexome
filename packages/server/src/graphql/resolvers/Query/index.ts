import { prisma } from "../../../client"

export const resolvers = {
  Query: {
    getBooks: async (_, { query }) => {
      prisma.book.findMany({
        where: {
          title: {
            contains: query
          }
        }
      })
    }

  }
}
