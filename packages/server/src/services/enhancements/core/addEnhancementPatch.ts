import { Prisma } from "@prisma/client"
import { EnhancementType } from "../../../generated/graphql"
import { prisma } from "../../../prisma"
import { Operation } from "fast-json-patch"
import { coalesceEnhancementData } from "./coalesceEnhancementData"
import { validateEnhancementPatch } from "./validateEnhancementPatch";

export async function addEnhancementPatch(params: {
  enhancementId: string,
  enhancementType: EnhancementType,
  patch: Operation,
  userId: string | 'SUPER_USER'
}) {
  const {
    userId,
    enhancementId,
    enhancementType: _enhancementType,
    patch,
  } = params

  const enhancement = await prisma.enhancement.findUnique({
    where: {
      id: enhancementId,
    },
  })

  if (!enhancement) {
    throw new Error('Enhancement not found')
  }

  // Make sure specified enhancement type is included in the enhancement
  const enhancementType = enhancement.included_types.find((t) => t === _enhancementType) as EnhancementType | undefined

  if (!enhancementType) {
    throw new Error('Enhancement type not found')
  }

  if (userId !== 'SUPER_USER') {
    const subscription = await prisma.subscription.findFirst({
      where: {
        user_id: userId,
      },
    })

    if (!subscription) {
      throw new Error('User does not have an active subscription')
    }
  }

  try {
    const enhancementData = await coalesceEnhancementData({
      enhancement,
    })

    await validateEnhancementPatch({
      enhancementData,
      patch,
      enhancementType
    })

    await prisma.enhancement_patch.create({
      data: {
        enhancement_id: enhancement.id,
        type: enhancementType,
        operation: patch as unknown as Prisma.InputJsonValue,
        created_by_id: userId === 'SUPER_USER' ? undefined : userId,
      },
    }) 
  } catch (e) {
    console.log('error', e)
  }
}

