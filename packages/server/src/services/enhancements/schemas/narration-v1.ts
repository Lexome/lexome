import zod from 'zod'
import { anchor } from './shared/anchor-v1'

export type Narration = zod.infer<typeof narrationSchema>

export type NarrationSegment = zod.infer<typeof narrationSegmentSchema>

export const narrationSegmentSchema = zod.object({
  anchor,
  url: zod.string().url(),
  timestamps: zod.array(zod.object({
    word: zod.string(), 
    start: zod.number(),
    end: zod.number(),
  })),
})

export const narrationSchema = zod.object({
  chunks: zod.array(
    zod.object({
      id: zod.string().uuid(),
      anchor,
      segments: zod.array(narrationSegmentSchema) 
    })
  ),
})