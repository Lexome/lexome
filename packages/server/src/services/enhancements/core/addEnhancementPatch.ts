import { Prisma, subscription } from "@prisma/client"
import { EnhancementType } from "../../../generated/graphql"
import { prisma } from "../../../prisma"
import { Operation } from "fast-json-patch"
import { coalesceEnhancementData } from "./coalesceEnhancementData"
import {
  authorizeEnhancementPatch,
  validateEnhancementPatch,
} from "./validateEnhancementPatch";

import { SuperUserString, SUPER_USER_STRING } from "../constants";

export async function addEnhancementPatch(params: {
  enhancementId: string,
  enhancementType: EnhancementType,
  patch: Operation,
  userId: string | SuperUserString
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

  let subscription: subscription | SuperUserString

  if (userId !== SUPER_USER_STRING) {
    const fetched = await prisma.subscription.findFirst({
      where: {
        user_id: userId,
      },
    })

    if (!fetched) {
      throw new Error('User does not have an active subscription')
    }

    subscription = fetched

  } else {
    subscription = SUPER_USER_STRING
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

    await authorizeEnhancementPatch({
      enhancementData,
      patch,
      enhancementType,
      subscription
    })

    await prisma.enhancement_patch.create({
      data: {
        enhancement_id: enhancement.id,
        type: enhancementType,
        operation: patch as unknown as Prisma.InputJsonValue,
        created_by_id: userId === SUPER_USER_STRING ? undefined : userId,
      },
    }) 
  } catch (e) {
    console.log('error', e)
  }
}

