import zod from 'zod'

import { anchor } from './shared/anchor-v1'

export type ReadingComprehension = zod.infer<typeof readingComprehension>

export const readingComprehension = zod.object({
  id: zod.string().uuid(),
  questions: zod.array(
    zod.object({
      id: zod.string().uuid(),
      createdBy: zod.string().uuid(),
      createdAt: zod.string().datetime(),
      anchor: anchor,
      question: zod.string(),
      answer: zod.optional(zod.string()),
      choices: zod.optional(zod.array(
        zod.object({
          id: zod.string().uuid(),
          value: zod.string(),
        })
      ))
    })
  ),
  responses: zod.record(
    zod.string().uuid(),
    zod.object({
      userId: zod.string().uuid(),
      questionId: zod.string().uuid(),
      createdAt: zod.string().datetime(),
      updatedAt: zod.optional(zod.string().datetime()),
      value: zod.string(),
    })
  ),
})