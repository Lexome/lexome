import { enhancement_patch } from "@prisma/client"
import { Enhancement, EnhancementPatch, EnhancementType } from "../../../generated/graphql"

export const convertDbPatchToGqlFormat = (params: {
  patch: enhancement_patch
}): EnhancementPatch => {
  const { patch } = params

  return {
    ...patch,
    type: patch.type as EnhancementType,
    operation: JSON.stringify(patch.operation),
    createdAt: patch.created_at.toISOString(),
    // createdById: patch.created_by_id,
  }
}