import { Resolvers } from "../../generated/graphql";

import { loginWithGoogle, createUserWithGoogle } from "../../services/auth";

export const resolvers: Resolvers = {
  Mutation: {
    logInWithGoogle: async (parent, args) => {
      const googleAccessToken = args.googleAccessToken

      try {
        const jwt = await loginWithGoogle({ token: googleAccessToken })
        return {
          jwtToken: jwt,
          success: true,
          userId: '',
        }
      } catch (e) {
        const jwt = await createUserWithGoogle({ token: googleAccessToken })
        return {
          jwtToken: jwt,
          success: true,
          userId: '',
        }
      }

    },
    createUserWithGoogle: async (parent, args) => {
      const googleAccessToken = args.googleAccessToken

      return await createUserWithGoogle({ token: googleAccessToken })
    }
  }
}