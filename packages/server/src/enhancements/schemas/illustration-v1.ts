import zod from 'zod'

import { anchor } from './shared/anchor-v1'

export type Illustration = zod.infer<typeof illustrationV1>

export const illustrationV1 = zod.object({
  id: zod.string().uuid(),
  illustrations: zod.array(
    zod.object({
      id: zod.string().uuid(),
      anchor: anchor,
      image: zod.string(),
      createdAt: zod.string().datetime(),
      postedBy: zod.string().uuid(),
    })
  ),
})

zod.date().parse('2021-08-25T00:00:00.000Z')