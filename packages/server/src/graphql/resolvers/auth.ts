import { Resolvers } from "../../generated/graphql";

import { loginWithGoogle, createUserWithGoogle } from "../../services/auth";

export const resolvers: Resolvers = {
  Mutation: {
    loginWithGoogle: async (parent, args) => {
      const googleAccessToken = args.googleAccessToken

      return await loginWithGoogle({ token: googleAccessToken })

    },
    createUserWithGoogle: async (parent, args) => {
      return await createUserWithGoogle({ token: args.googleAccessToken })
    }
  }
}