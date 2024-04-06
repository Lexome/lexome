import { Request } from 'express'
import { prisma } from "./client"

const exampleFetch = () => prisma.user.findUnique({
  where: {
    id: '123'
  },
  include: {
    subscriptions: true
  }
})

export type MiddlewareRequest = {
  user?: Awaited<ReturnType<typeof exampleFetch>>
} & Request