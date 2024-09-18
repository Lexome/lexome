import { enhancement, EnhancementType, Prisma } from "@prisma/client"
import { prisma } from "../../../prisma"
import { applyOperation, Operation } from "fast-json-patch"
import { coalesceEnhancementData } from "./coalesceEnhancementData"
import { enhancementTypeSpecs } from "./enhancementTypeSpecs"
import { Schemas } from "../schemas"

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export type BaseOperation = DistributiveOmit<Operation, 'path'>

export async function addEnhancementEvent<
  Type extends EnhancementType,
  Shape extends Schemas[Type],
  A extends keyof Shape,
  B extends keyof Shape[A]=never,
  C extends keyof Shape[A][B]=never,
  D extends keyof Shape[A][B][C]=never,
  E extends keyof Shape[A][B][C][D]=never,
  F extends keyof Shape[A][B][C][D][E]=never,
> (params: {
  enhancementId: string,
  enhancementType: Type,
  operation: BaseOperation,
  path: [A, B?, C?, D?, E?, F?],
  userId: string | 'SUPER_USER'
}) {
  const {
    userId,
    enhancementId,
    enhancementType: _enhancementType,
    operation: _operation,
    path,
  } = params

  const enhancement = await prisma.enhancement.findUnique({
    where: {
      id: enhancementId,
    },
  })

  console.log('enhancement', enhancement)

  if (!enhancement) {
    throw new Error('Enhancement not found')
  }

  // Make sure specified enhancement type is included in the enhancement
  const enhancementType = enhancement.included_types.find((t) => t === _enhancementType)

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
    const operation = transformOperation({
      operation: _operation,
      path,
    })

    await validateEnhancementEvent({
      enhancement,
      operation,
      enhancementType,
    })

    await prisma.enhancement_event.create({
      data: {
        enhancement_id: enhancement.id,
        type: enhancementType,
        operation: operation as unknown as Prisma.InputJsonValue,
        created_by_id: userId === 'SUPER_USER' ? undefined : userId,
      },
    }) 
  } catch (e) {
    console.log('error', e)
  }
}

const transformOperation = (params: {
  operation: BaseOperation,
  path: any[],
}): Operation => {
  const { operation, path } = params
  const pathParams = path.map(p => p === -1 ? '-' : p)

  return {
    ...operation,
    path: `/${pathParams.join('/')}`,
  }
}

const validateEnhancementEvent = async (params: {
  enhancement: enhancement,
  operation: Operation,
  enhancementType: EnhancementType
}) => {
  const { enhancement, operation, enhancementType } = params

  const coalescedData = await coalesceEnhancementData({
    enhancement,
  })
  
  const coalescedDataForType = coalescedData[enhancementType]

  applyOperation(coalescedDataForType, operation)

  const schema = enhancementTypeSpecs[enhancementType].schema

  // Zod schema validation
  // This will throw if the data is invalid
  schema.parse(coalescedDataForType) 
}