import jwt from 'jsonwebtoken'
import { prisma } from '../prisma'

import 'dotenv/config'

const LIVE_GOOGLE_CLIENT_ID = process.env.LIVE_GOOGLE_CLIENT_ID
const DEV_GOOGLE_CLIENT_ID = process.env.DEV_GOOGLE_CLIENT_ID

const clientIds = [LIVE_GOOGLE_CLIENT_ID, DEV_GOOGLE_CLIENT_ID]

export const verifyJwtToken = (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')

  return decoded as { userId: string }
}

// Verify Google token by requesting a google token info endpoint
export const verifyGoogleToken = async (params: { token: string }) => {
  const { token } = params

  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`)
  
  if (!response.ok) {
    throw new Error('Failed to verify Google token')
  }

  const payload = await response.json()

  if (!clientIds.includes(payload.aud)) {
    throw new Error('Token not issued for this client')
  }

  return payload
}

export const loginWithGoogle = async (params: { token: string }) => {
  const { token } = params

  const { email } = await verifyGoogleToken({ token })

  // Find user by email
  const user = await prisma.user.findFirst({
    where: { email }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Generate JWT token
  const jwtToken = jwt.sign(
    { 
      userId: user.id,
      email: user.email
    },
    process.env.JWT_SECRET || 'secret',
  )

  return jwtToken
}

export const createUserWithGoogle = async (params: { token: string }) => {
  const { token } = params

  if (!token) {
    return { error: 'Google token is required' }
  }

  const { email } = await verifyGoogleToken({ token })

  if (await prisma.user.findUnique({ where: { email } })) {
    return { error: 'User already exists' }
  }

  const user = await prisma.user.create({
    data: {
      email,
      first_name: '',
      last_name: '',
      display_name: '',
    },
  })

  const jwtToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'secret',
  )

  return jwtToken
}

// app.post('/link-user', async (request, reply) => {
//   const { phone, token, verificationCode } = request.body as {
//     phone: string,
//     token: string,
//     verificationCode: string,
//   }

//   const user = await prisma.user.findUnique({
//     where: { phone }
//   })

//   if (user?.verification_code !== verificationCode) {
//     return reply.status(400).send({ error: 'Invalid verification code' })
//   }

//   if (!user) {
//     return reply.status(404).send({ error: 'User not found' })
//   }

//   // Verify Google token
//   const {
//     email,
//   } = await verifyGoogleToken({ token, clientId: process.env.GOOGLE_CLIENT_ID || '' })

//   if (user.email !== email) {
//     return reply.status(400).send({ error: 'Account has already been linked to another email' })
//   }

//   const linkedUser = await prisma.user.update({
//     where: { phone },
//     data: {
//       email,
//     }
//   })

//   reply.status(200).send({
//     user: linkedUser,
//   })
// })
