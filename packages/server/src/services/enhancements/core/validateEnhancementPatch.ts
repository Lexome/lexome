import { EnhancementType } from "../../../generated/graphql"
import { applyOperation, Operation } from "fast-json-patch"
import { enhancementTypeSpecs } from "./enhancementTypeSpecs"

export const validateEnhancementPatch = async (params: {
  enhancementData: Record<any, any>,
  patch: Operation,
  enhancementType: EnhancementType
}) => {
  const { enhancementData, patch, enhancementType } = params
  
  const enhancementDataForType = enhancementData[enhancementType]

  applyOperation(enhancementDataForType, patch)

  const schema = enhancementTypeSpecs[enhancementType].schema

  // Zod schema validation
  // This will throw if the data is invalid
  schema.parse(enhancementDataForType) 
}