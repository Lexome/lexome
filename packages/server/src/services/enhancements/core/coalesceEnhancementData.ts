import { enhancement as Enhancement } from "@prisma/client"
import { applyPatch, Operation } from 'fast-json-patch'

import { enhancementTypeSpecs } from "./enhancementTypeSpecs"
import { prisma } from "../../../prisma"

export const coalesceEnhancementData = async (params: {
  enhancement: Enhancement,
  save?: boolean,
}) => {
  const { enhancement, save } = params
  const types = enhancement.included_types

  const typeSpecs = types.map((type) => enhancementTypeSpecs[type])

  const initialCoalescedData = enhancement.coalesced_data
  const coalescedData = typeof initialCoalescedData === 'object' ? { ...initialCoalescedData } : {}
  const lastCoalescedTimestamp = enhancement.coalesced_timestamp

  const newEvents = await prisma.enhancement_event.findMany({
    where: {
      enhancement_id: enhancement.id,
      created_at: {
        gt: lastCoalescedTimestamp || undefined,
      },
    },
  })

  for (const type of typeSpecs) {
    const coalescedDataForType = coalescedData[type.slug] || {}

    const typeEvents = newEvents.filter((e) => e.type === type.slug)

    if (typeEvents.length > 0) {
      applyPatch(coalescedDataForType, typeEvents.map(e => e.operation as unknown as Operation))
    }

    coalescedData[type.slug] = coalescedDataForType
  }

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