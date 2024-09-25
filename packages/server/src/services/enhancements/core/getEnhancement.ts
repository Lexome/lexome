import { prisma } from "../../../prisma"
import { coalesceEnhancementData } from "./coalesceEnhancementData"

export const getEnhancement = async (enhancementId: string) => {
  const enhancement = await prisma.enhancement.findUnique({
    where: {
      id: enhancementId,
    },
  })

  if (!enhancement) {
    throw new Error('Enhancement not found')
  }

  const coalescedData = await coalesceEnhancementData({
    enhancement,
  })

  return {
    enhancement,
    coalescedData
  }
}