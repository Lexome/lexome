import { Resolvers } from "../../generated/graphql";
import { prisma } from "../../prisma";
import { personalizationSchema } from '../../services/field-validation'
import { convertObjectPropertiesToCamelCase } from "../../utils";

export const resolvers: Resolvers = {
  User: {
    personalization: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('User not found')
      }

      return convertObjectPropertiesToCamelCase(context.user.personalization || {})
    }
  },
  Mutation: {
    updatePersonalization: async (parent, args, context) => {
      const user = context.user;
      const {
        themeMode,
        readerFontSize,
        readerFontStyle,
      } = args

      if (!user) {
        throw new Error('User not found')
      }

      const currentPersonalization = user.personalization

      const newPersonalization = personalizationSchema.parse({
        themeMode,
        readerFontSize,
        readerFontStyle,
        ...currentPersonalization,
      })

      await prisma.user.update({
        where: { id: user.id },
        data: { personalization: newPersonalization },
      })

      return newPersonalization
    }
  }
}