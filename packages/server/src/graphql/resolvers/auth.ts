import { Resolvers } from "../../generated/graphql";
import { prisma } from "../../prisma";

import { loginWithGoogle, createUserWithGoogle, beginEmailLogIn, completeEmailLogIn } from "../../services/auth";
import { convertObjectPropertiesToCamelCase } from "../../utils";

export const resolvers: Resolvers = {
  Query: {
    getAuthenticatedUser: async (parent, args, context) => {
      if (!context.userId) {
        throw new Error('User not authenticated')
      }

      const user = await prisma.user.findUnique({ where: { id: context.userId } })

      if (!user) {
        throw new Error('User not found')
      }

      return convertObjectPropertiesToCamelCase(user)
    }
 },

  Mutation: {
    logInWithGoogle: async (parent, args) => {
      const googleAccessToken = args.googleAccessToken

      try {
        const jwt = await loginWithGoogle({ token: googleAccessToken })
        return {
          jwt,
          success: true,
          userId: '',
        }
      } catch (e) {
        const jwt = await createUserWithGoogle({ token: googleAccessToken })
        return {
          jwt,
          success: true,
          userId: '',
        }
      }
    },

    createUserWithGoogle: async (parent, args) => {
      const googleAccessToken = args.googleAccessToken

      return await createUserWithGoogle({ token: googleAccessToken })
    },

    beginEmailLogIn: async (parent, args) => {
      const email = args.email

      return await beginEmailLogIn({ email })
    },

    completeEmailLogIn: async (parent, args) => {
      const { email, verificationCode } = args

      const jwt = await completeEmailLogIn({
        email,
        verificationCode
      })

      if (!jwt) {
        return {
          success: false,
          jwt: '',
        }
      }

      return {
        success: true,
        jwt: jwt as string,
      }
    }
  }
}