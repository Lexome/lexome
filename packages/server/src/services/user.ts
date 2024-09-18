import jwt from "jsonwebtoken"

import { AUTH_SECRET } from "../config"
import { prisma } from "../prisma"

const findUser = async (
  id: string,
  options?: {
    includeSubscriptions: boolean
  }
) => {
  const { includeSubscriptions } = options || {}

  const user = await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      subscriptions: includeSubscriptions
    }
  })

  return user
}

export type User = NonNullable<Awaited<ReturnType<typeof findUser>>>

export const createUserJwt = (user: User) => {
  const jwtBody = {
    id: user.id,
  }

  return jwt.sign(jwtBody, AUTH_SECRET)
}

export const verifyUserJwt = (token: string) => {
  if (!token) {
    return null
  }

  const verified = jwt.verify(token, AUTH_SECRET)
  return verified.id
}


