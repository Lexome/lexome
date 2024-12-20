import * as z from 'zod'

export type Anchor = z.infer<typeof anchor>

export const anchor = z.object({
  word: z.string().optional(),
  prefixHash: z.string().optional(),
  suffixHash: z.string().optional(),
  prefixHashComplete: z.boolean().optional(),
  suffixHashComplete: z.boolean().optional(),
  cfiStart: z.string().optional(),
  cfiEnd: z.string().optional(),
})

export const anchorOptional = anchor.optional()
