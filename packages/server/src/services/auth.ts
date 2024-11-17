import jwt from 'jsonwebtoken'
import { prisma } from '../prisma'

import 'dotenv/config'

export const verifyJwtToken = (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')

  return decoded as { userId: string }
}

// Verify Google token by requesting a google token info endpoint
export const verifyGoogleToken = async (params: { token: string, clientId: string }) => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo')
  
  if (!response.ok) {
    throw new Error('Failed to verify Google token')
  }

  const payload = await response.json()

  if (payload.aud !== params.clientId) {
    throw new Error('Token not issued for this client')
  }

  return payload
}

export const loginWithGoogle = async (params: { token: string }) => {
  const { token } = params

  const { email } = await verifyGoogleToken({
    token,
    clientId: process.env.GOOGLE_CLIENT_ID || ''
  })

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

  const { email } = await verifyGoogleToken({ token, clientId: process.env.GOOGLE_CLIENT_ID || '' })

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
