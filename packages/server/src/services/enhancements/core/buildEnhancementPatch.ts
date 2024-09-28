import { EnhancementType } from "../../../generated/graphql"
import { Operation } from "fast-json-patch"
import { Schemas } from "../schemas"

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export type BaseOperation = DistributiveOmit<Operation, 'path'>

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

export function buildEnhancementPatch<
  Type extends EnhancementType,
  Shape extends Schemas[Type],
  A extends keyof Shape,
  B extends keyof Shape[A]=never,
  C extends keyof Shape[A][B]=never,
  D extends keyof Shape[A][B][C]=never,
  E extends keyof Shape[A][B][C][D]=never,
  F extends keyof Shape[A][B][C][D][E]=never,
>(params: {
  enhancementType: EnhancementType,
  operation: BaseOperation,
  path: [A, B?, C?, D?, E?, F?],
}) {
  const {
    enhancementType: _enhancementType,
    operation: _operation,
    path,
  } = params

  const patch = transformOperation({
    operation: _operation,
    path,
  }) 

  return patch
}