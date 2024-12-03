import { Resolvers } from "../../generated/graphql";
import { addBookToCollection, createNewCollection, getUserCollection, removeBookFromCollection } from "../../services/userCollections";
import { convertObjectPropertiesToCamelCase } from "../../utils";
import { authenticateUser } from "../utils";

export const resolvers: Resolvers = {
  Query: {
    getUserCollection: async (parent, args, context) => {
      authenticateUser(context)

      const collection = await getUserCollection({ userId: context.userId! })

      return convertObjectPropertiesToCamelCase(collection)
    }
  },

  Mutation: {
    createUserCollection: async (parent, args, context) => {
      return convertObjectPropertiesToCamelCase(await createNewCollection({ userId: context.userId }))
    },

    addBookToUserCollection: async (parent, args, context) => {
      authenticateUser(context)

      return convertObjectPropertiesToCamelCase(await addBookToCollection({ userId: context.userId, bookId: args.bookId }))
    },

    removeBookFromUserCollection: async (parent, args, context) => {
      authenticateUser(context)

      return convertObjectPropertiesToCamelCase(await removeBookFromCollection({ userId: context.userId, bookId: args.bookId }))
    }
  }
}
