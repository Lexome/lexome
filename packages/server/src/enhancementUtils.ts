import { Prisma, PrismaClient } from '@prisma/client'
import { applyOperation, applyPatch, Operation, Operation as PatchOperation } from 'fast-json-patch'

import { ZodObject } from 'zod'
import { MiddlewareRequest } from './middleware';

// Needed to omit the path property from all operation subtypes
type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export type BaseOperation = DistributiveOmit<PatchOperation, 'path'>

type ModelNames = Prisma.ModelName; // "User" | "Post"

export type PrismaModels = {
  [M in ModelNames]: Exclude<
    Awaited<ReturnType<PrismaClient[Uncapitalize<M>]["findUnique"]>>,
    null
  >;
};

const prisma = new PrismaClient()

export const isUserAdmin = (params: {
  req: MiddlewareRequest,
  enhancementId: string
}) => {
  if (!params.req.user) {
    return false
  }

  const adminSubscriptions = params.req.user.subscriptions.filter(sub => {
    sub.role === 'admin' &&
    sub.enhancement_id === params.enhancementId
  });

  return adminSubscriptions.length > 0
}

export const isUserSubscribed = (params: {
  req: MiddlewareRequest,
  enhancementId: string
}) => {
  if (!params.req.user) {
    return false
  }

  const subscriptions = params.req.user.subscriptions.filter(sub => {
    sub.enhancement_id === params.enhancementId
  });

  return subscriptions.length > 0
}

export const coalesceEnhancementData = async (params: {
  enhancement: PrismaModels['enhancement'],
  enhancementTypes: PrismaModels['enhancement_type'][],
}) => {
  const { enhancement, enhancementTypes } = params

  const coalescedData: Record<string, any> = enhancement.coalesced_data || {} as any
  const lastCoalescedTimestamp = enhancement.coalesced_timestamp

  const newEvents = await prisma.enhancement_event.findMany({
    where: {
      enhancement_id: enhancement.id,
      created_at: {
        gt: lastCoalescedTimestamp || undefined,
      },
    },
  })

  for (const type of enhancementTypes) {
    const coalescedDataForType = coalescedData[type.slug] || {}

    const typeEvents = newEvents.filter((e) => e.type_id === type.id)

    if (typeEvents.length > 0) {
      applyPatch(coalescedDataForType, typeEvents.map(e => e.operation as unknown as Operation))
    }

    coalescedData[type.slug] = coalescedDataForType
  }

  return coalescedData
}

export const getEnhancement = async (enhancementId: string) => {
  const enhancement = await prisma.enhancement.findUnique({
    where: {
      id: enhancementId,
    },
    include: {
      included_types: true
    }
  })

  if (!enhancement) {
    throw new Error('Enhancement not found')
  }

  const coalescedData = coalesceEnhancementData({
    enhancement,
    enhancementTypes: enhancement.included_types
  })

  return coalescedData
}

export async function addEnhancementEvent<
  Schema extends ZodObject<any>,
  Shape extends ReturnType<Schema['parse']>,
  A extends keyof Shape,
  B extends keyof Shape[A]=never,
  C extends keyof Shape[A][B]=never,
  D extends keyof Shape[A][B][C]=never,
  E extends keyof Shape[A][B][C][D]=never,
  F extends keyof Shape[A][B][C][D][E]=never,
> (params: {
  enhancementId: string,
  enhancementTypeId: string
  operation: BaseOperation,
  path: [A, B?, C?, D?, E?, F?],
  schema: Schema,
  userId: string
}) {
  const enhancement = await prisma.enhancement.findUnique({
    where: {
      id: params.enhancementId,
    },
    include: {
      included_types: true
    }
  })

  if (!enhancement) {
    throw new Error('Enhancement not found')
  }

  const enhancementType = enhancement.included_types.find((t) => t.id === params.enhancementTypeId)

  if (!enhancementType) {
    throw new Error('Enhancement type not found')
  }

  const typeSlug = enhancementType.slug

  try {
    const coalescedData = await coalesceEnhancementData({
      enhancement,
      enhancementTypes: enhancement.included_types,
    })

    const coalescedDataForType = coalescedData[typeSlug]

    const operation: PatchOperation = {
      ...params.operation,
      path: `/${params.path.join('/')}`,
    }

    applyOperation(coalescedDataForType, operation)

    // Zod schema validation
    // This will throw if the data is invalid
    params.schema.parse(coalescedDataForType)
    
    await prisma.enhancement_event.create({
      data: {
        enhancement_id: enhancement.id,
        operation: params.operation as any,
        type_id: params.enhancementTypeId,
        created_by_id: params.userId
      },
    }) 
  } catch (e) {

  }
}

export const findAndCoalesceEnhancement = async (enhancementId: string) => {
  const enhancement = await prisma.enhancement.findUnique({
    where: {
      id: enhancementId,
    },
    include: {
      included_types: true
    }
  })

  if (!enhancement) {
    throw new Error('Enhancement not found')
  }

  const coalescedData = await coalesceEnhancementData({
    enhancement,
    enhancementTypes: enhancement.included_types
  })

  return {
    enhancement,
    coalescedData
  }
}

