import { enhancement as Enhancement } from "@prisma/client"

import { enhancementTypeSpecs } from "./enhancementTypeSpecs"
import { prisma } from "../../../prisma"
import { applyEnhancementPatches } from './applyEnhancementPatches'
import { convertDbPatchToGqlFormat } from "./convertDbPatchToGqlFormat"



export const coalesceEnhancementData = async (params: {
  enhancement: Enhancement,
  save?: boolean,
}) => {
  const { enhancement, save } = params

  const initialCoalescedData = enhancement.coalesced_data
  let coalescedData = typeof initialCoalescedData === 'object' ? { ...initialCoalescedData } : {}
  const lastCoalescedTimestamp = enhancement.coalesced_timestamp

  const newPatches = await prisma.enhancement_patch.findMany({
    where: {
      enhancement_id: enhancement.id,
      created_at: {
        gt: lastCoalescedTimestamp || undefined,
      },
    },
  })

  console.log('newPatches', newPatches)

  coalescedData = applyEnhancementPatches({
    patches: newPatches.map(patch => convertDbPatchToGqlFormat({ patch })),
    data: coalescedData
  })

  if (save) {
    await prisma.enhancement.update({
      where: {
        id: enhancement.id,
      },
      data: {
        coalesced_data: coalescedData,
        coalesced_timestamp: new Date(),
      },
    })
  }

  return coalescedData
}

export const coalesceEnhancementDataById = async (params: {
  id: string
}) => {
  const { id } = params

  const enhancement = await prisma.enhancement.findUnique({
    where: {
      id
    }
  })

  console.log('enhancement', enhancement)

  if (!enhancement) {
    throw new Error('Enhancement not found')
  }

  return coalesceEnhancementData({
    enhancement,
  })
}
