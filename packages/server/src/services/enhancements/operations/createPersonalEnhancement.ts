import { EnhancementType, Role } from "@prisma/client"
import { prisma } from "../../../prisma"

export const createPersonalEnhancement = async ({
  bookId,
  userId
}: { bookId: string, userId: string }) => {
  const defaultEnhancementTypes = [
    EnhancementType.SUMMARY,
  ]

  const defaultEnhancement = await prisma.enhancement.create({
    data: {
      book_id: bookId,
      is_personal: true,
      title: 'Personal Enhancement',
      included_types: defaultEnhancementTypes,
    }
  })

  await prisma.subscription.create({
    data: {
      user_id: userId,
      enhancement_id: defaultEnhancement.id,
      role: Role.ADMIN
    }
  })

  return defaultEnhancement
}