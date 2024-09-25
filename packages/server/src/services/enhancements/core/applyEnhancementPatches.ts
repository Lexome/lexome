import { applyPatch, deepClone, Operation } from "fast-json-patch"
import { EnhancementPatch } from "../../../generated/graphql"
import { enhancementTypeSpecs } from './enhancementTypeSpecs'

export const applyEnhancementPatches = (params: {
  patches: EnhancementPatch[],
  data: Record<any, any>,
}) => {
  const { patches, data: _data } = params

  const data = deepClone(_data)

  const typeSpecs = Object.values(enhancementTypeSpecs)

  for (const type of typeSpecs) {
    const coalescedDataForType = data[type.slug] || {}

    const patchesForType = patches.filter((e) => e.type === type.slug)

    if (patchesForType.length > 0) {
      applyPatch(coalescedDataForType, patchesForType.map(e => JSON.parse(e.operation) as Operation))
    }

    data[type.slug] = coalescedDataForType
  }

  return data
}