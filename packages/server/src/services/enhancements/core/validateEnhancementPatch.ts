import { EnhancementType } from "../../../generated/graphql"
import { applyOperation, Operation } from "fast-json-patch"
import { enhancementTypeSpecs } from "./enhancementTypeSpecs"
import { subscription } from "@prisma/client"
import { SuperUserString, SUPER_USER_STRING } from "../constants"
import { Enhancements } from "../schemas"

export const validateEnhancementPatch = async (params: {
  enhancementData: Record<any, any>,
  patch: Operation,
  enhancementType: EnhancementType,
}) => {
  const { enhancementData, patch, enhancementType } = params
  
  const enhancementDataForType = enhancementData[enhancementType]

  applyOperation(enhancementDataForType, patch)

  const schema = enhancementTypeSpecs[enhancementType].schema

  // Zod schema validation
  // This will throw if the data is invalid
  schema.parse(enhancementDataForType) 
}

export const authorizeEnhancementPatch = async (params: {
  enhancementData: Record<any, any>,
  patch: Operation,
  enhancementType: EnhancementType,
  subscription: subscription | SuperUserString,
}): Promise<boolean> => {
  const { enhancementData, patch, enhancementType, subscription } = params

  if (typeof subscription === 'string') {
    return subscription === 'SUPER_USER'
  }

  const authorizor = enhancementTypeSpecs[enhancementType].authorizor

  if (!authorizor) {
    return true
  }

  return await authorizor({
    enhancementData,
    patch,
    subscription
  })
}