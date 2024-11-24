import { EnhancementType, Role } from "../../../generated/graphql"
import { prisma } from "../../../prisma"

export const createEnhancement = async (params: {
  includedTypes: EnhancementType[],
  title: string,
  bookId: string,
  publisherId?: string,
  userId?: string,
  isDefault?: boolean,
}) => {
  const { publisherId, userId, bookId, includedTypes, title, isDefault } = params

  const existingEnhancement = await prisma.enhancement.findFirst({
    where: {
      book_id: bookId,
      included_types: {
        hasEvery: includedTypes,
      },
    },
  })

  if (existingEnhancement) {
    return existingEnhancement
  }

  const enhancement = await prisma.enhancement.create({
    data: {
      included_types: includedTypes,
      title: title,
      coalesced_data: {},
      coalesced_timestamp: new Date(),
      book: {
        connect: {
          id: bookId,
        },
      },
      publisher: publisherId ? {
        connect: {
          id: publisherId,
        },
      } : undefined,
      is_default: isDefault,
    }
  })

  if (userId) {
    await prisma.subscription.create({
      data: {
        user_id: userId,
        enhancement_id: enhancement.id,
        role: Role.Admin,
      },
    })
  }

  return enhancement
}