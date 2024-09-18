// packages/schemas/src/summary.ts

import zod from 'zod'
import { anchor } from './shared/anchor-v1'

export type Summary = zod.infer<typeof summarySchema>

export const summarySchema = zod.object({
  chunks: zod.array(
    zod.object({
      id: zod.string().uuid(),
      anchor: anchor,
      text: zod.string(),
    })
  ),
})
