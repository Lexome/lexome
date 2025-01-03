import jwt from 'jsonwebtoken'
import { prisma } from '../prisma'
import { sendEmail } from './email'
import { user } from '@prisma/client'
import { LIVE_GOOGLE_CLIENT_ID, DEV_GOOGLE_CLIENT_ID, JWT_SECRET } from '../config'

const clientIds = [LIVE_GOOGLE_CLIENT_ID, DEV_GOOGLE_CLIENT_ID]

export const verifyJwtToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET)

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
  return createJwtForUser({ user })
}

const createJwtForUser = (params: { user: user }) => {
  const { user } = params

  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
  )
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

  return createJwtForUser({ user })
}

export const getAuthenticatedUserId = (params: {
  token: string
}) => {
  const { token } = params
  const { userId } = verifyJwtToken(token)

  return userId
}

export const getAuthenticatedUser = (params: {
  token: string
}) => {
  const { token } = params
  const userId = getAuthenticatedUserId({ token })

  return prisma.user.findUnique({
    where: { id: userId }
  })
}

// Generate a sequence of 6 alphanumeric characters
const generateVerificationCode = () => {
  return Math.random().toString(36).substring(2, 8)
}

const messageTemplate = (params: {
  verificationCode: string,
  email: string,
}) => {
  const { verificationCode, email } = params

  return [
    `Your log-in link for Lexome is https://lexome.com/login?verification_code=${verificationCode}&email=${email}.`,
    `Alternatively, you can enter the code ${verificationCode} into the Lexome app.`
  ].join(' ')
}

const sendVerificationCode = async (params: {
  email: string
  verificationCode: string
}) => {
  const { email, verificationCode } = params

  await sendEmail({
    to: email,
    subject: 'Lexome Log-In Link',
    message: messageTemplate({
      verificationCode,
      email,
    }),
  })
}

export const beginEmailLogIn = async (params: {
  email: string
}) => {
  const { email } = params

  let user = await prisma.user.findFirst({ where: { email } })

  if (!user) {
    user = await prisma.user.create({ data: { email, first_name: '', last_name: '', display_name: '' } })
  }

  const verificationCode = generateVerificationCode()

  await prisma.user.update({ where: { id: user.id }, data: { verification_code: verificationCode } })

  sendVerificationCode({ email, verificationCode })

  return { success: true }
}

export const completeEmailLogIn = async (params: {
  email: string
  verificationCode: string
}): Promise<string | boolean> => {
  const { email, verificationCode } = params

  const user = await prisma.user.findFirst({ where: { email } })

  if (!user) {
    return false
  }

  if (user.verification_code === verificationCode) {
    await prisma.user.update({ where: { id: user.id }, data: { verification_code: null } })
    return createJwtForUser({ user })
  }

  return false
}
