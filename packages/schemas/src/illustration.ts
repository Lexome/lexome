import zod from 'zod'

import { anchor, version } from './shared'

export type Illustration = zod.infer<typeof illustrationSchema>

export const illustrationSchema = zod.object({
  illustrations: zod.array(
    zod.object({
      id: zod.string().uuid(),
      anchor: anchor,
      image: zod.string(),
      createdAt: zod.date(),
      postedBy: zod.string().uuid(),
    })
  ),
})


