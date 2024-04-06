import * as z from 'zod'

export const anchor = z.object({
  id: z.string().uuid(),
  word: z.string(),
  prefixHash: z.string(),
  suffixHash: z.string(),
})
