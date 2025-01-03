import { EnhancementType, Role } from "@prisma/client"
import { prisma } from "../../../prisma"

export const shareEnhancement = async ({
  userId,
  enhancementId
}: { userId: string, enhancementId: string }) => {
  const enhancement = await prisma.enhancement.findFirst({
    where: {
      id: enhancementId,
      is_personal: true
    }
  })

  if (!enhancement) {
    throw new Error('Enhancement not found')
  }

  await prisma.enhancement.update({
    where: {
      id: enhancementId
    },
    data: {
      is_personal: false,
    }
  })

  const newEnhancement = await prisma.enhancement.create({
    data: {
      book_id: enhancement.book_id,
      is_personal: true,
      title: 'Personal Enhancement',
      included_types: [EnhancementType.SUMMARY],
    }
  })

  await prisma.subscription.create({
    data: {
      user_id: userId,
      enhancement_id: newEnhancement.id,
      role: Role.ADMIN
    }
  })

  return {
    success: true
  }
} 