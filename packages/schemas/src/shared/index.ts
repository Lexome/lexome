import * as z from 'zod'

export const anchor = z.object({
  id: z.string().uuid(),
  word: z.string(),
  prefixHash: z.string(),
  suffixHash: z.string(),
})

export const version = z.object({
  major: z.number(),
  minor: z.number(),
  patch: z.number(),
  preRelease: z.optional(z.string()),
})
