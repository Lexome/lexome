import zod from 'zod'
import { anchor, version } from './shared'

export type ReadingComprehension = zod.infer<typeof readingComprehensionSchema>
 
export const readingComprehensionSchema = zod.object({
  questions: zod.array(
    zod.object({
      id: zod.string().uuid(),
      createdBy: zod.string().uuid(),
      createdAt: zod.date(),
      anchor,
      question: zod.string(),
      answer: zod.optional(zod.string()),
      choices: zod.optional(zod.array(
        zod.object({
          id: zod.string().uuid(),
          value: zod.string(),
        })
      )),
      maxGrade: zod.optional(zod.number()), 
      isPassFail: zod.optional(zod.boolean()),
    })
  ),
  responses: zod.array(
    zod.object({
      id: zod.string().uuid(),
      userId: zod.string().uuid(),
      questionId: zod.string().uuid(),
      value: zod.string(),
      grade: zod.optional(zod.number()),
      isAcceptable: zod.optional(zod.boolean()),
    })
  ),
})