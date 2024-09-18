
import { prisma } from '../prisma';
import { User } from '../user';
// import {
//   defaultErrors,
//   defaultSecurityRule,
//   success,
//   getByIdParams
// } from './spec/shared/misc'

import { applyOperation, applyPatch, Operation, Operation as PatchOperation } from 'fast-json-patch'

import { ZodObject } from 'zod'
import { Prisma, PrismaClient, EnhancementType } from '@prisma/client';

import { enhancementTypeSpecs } from './enhancementTypeSpecs';

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

export const getUserRole = ({
  enhancementId,
  user
}:{
  enhancementId: string,
  user: User
}) => {
  const subscriptions = user.subscriptions.filter(sub => {
    sub.enhancement_id === enhancementId
  });

  if (subscriptions.length === 0) {
    return new Error('User unauthorized')
  }

  if (subscriptions.length > 1) {
    throw new Error('Multiple subscriptions found')
  }

  const subscription = subscriptions[0]
  return subscription.role
}

export const coalesceEnhancementData = async (params: {
  enhancement: PrismaModels['enhancement'],
}) => {
  const { enhancement } = params
  const types = enhancement.included_types

  const typeSpecs = types.map((type) => enhancementTypeSpecs[type])

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

  for (const type of typeSpecs) {
    const coalescedDataForType = coalescedData[type.slug] || {}

    const typeEvents = newEvents.filter((e) => e.type === type.slug)

    if (typeEvents.length > 0) {
      applyPatch(coalescedDataForType, typeEvents.map(e => e.operation as unknown as Operation))
    }

    coalescedData[type.slug] = coalescedDataForType
  }

  return coalescedData
}

type Enhancement = PrismaModels['enhancement']

export const getEnhancement = async (enhancementId: string) => {
  const enhancement = await prisma.enhancement.findUnique({
    where: {
      id: enhancementId,
    },
  })

  if (!enhancement) {
    throw new Error('Enhancement not found')
  }

  const coalescedData = coalesceEnhancementData({
    enhancement,
  })

  return coalescedData
}

export async function createEnhancementEvent<
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
  enhancementType: EnhancementType,
  operation: BaseOperation,
  path: [A, B?, C?, D?, E?, F?],
  schema: Schema,
  userId: string
}) {
  const enhancement = await prisma.enhancement.findUnique({
    where: {
      id: params.enhancementId,
    },
  })

  if (!enhancement) {
    throw new Error('Enhancement not found')
  }

  const enhancementType = enhancement.included_types.find((t) => t === params.enhancementType)

  if (!enhancementType) {
    throw new Error('Enhancement type not found')
  }

  try {
    const coalescedData = await coalesceEnhancementData({
      enhancement,
    })

    const coalescedDataForType = coalescedData[enhancementType]

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
        type: enhancementType,
        operation: params.operation as any,
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

