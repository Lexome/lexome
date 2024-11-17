import fastify from 'fastify'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma'

import 'dotenv/config'

const app = fastify()
const port = process.env.PORT || 3000

// Auth middleware
app.addHook('preHandler', async (request, reply) => {
  // Skip auth for non-api routes
  if (!request.url.startsWith('/api')) {
    return
  }

  // Get token from Authorization header
  const authHeader = request.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return reply.status(401).send({ error: 'No token provided' })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const { userId } = decoded as { userId: string }
    request.user = { userId }
  } catch (err) {
    return reply.status(403).send({ error: 'Invalid token' })
  }
})

// Basic health check endpoint
app.get('/health', async (request, reply) => {
  return { status: 'ok' }
})

// Verify Google token by requesting a google token info endpoint
const verifyGoogleToken = async (params: { token: string, clientId: string }) => {
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

// Add login endpoint
app.post('/login', async (request, reply) => {
  const { token } = request.body as { token: string }

  if (!token) {
    return reply.status(400).send({ error: 'Google token is required' })
  }

  try {
    // Verify Google token
    const {
      email,
    } = await verifyGoogleToken({ token, clientId: process.env.GOOGLE_CLIENT_ID || '' })

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return reply.status(200).send({
        token: null,
        user: null,
        message: 'User not found',
      })
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { 
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    )

    reply.status(200).send({ 
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return reply.status(401).send({ error: 'Invalid Google token' })
  }
})

app.post('/create-user', async (request, reply) => {
  const { token } = request.body as { token: string }

  if (!token) {
    return reply.status(400).send({ error: 'Google token is required' })
  }

  const { email } = await verifyGoogleToken({ token, clientId: process.env.GOOGLE_CLIENT_ID || '' })

  if (await prisma.user.findUnique({ where: { email } })) {
    return reply.status(400).send({ error: 'User already exists' })
  }

  const user = await prisma.user.create({
    data: {
      email,
      first_name: '',
      last_name: '',
      display_name: '',
    },
  })

  reply.status(200).send({ user })
})

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



// Error handler
app.setErrorHandler((error, request, reply) => {
  console.error(error)
  reply.status(500).send({ error: 'Something went wrong!' })
})

// Start server
const start = async () => {
  try {
    await app.listen({ port: Number(port) })
    console.log(`Server running on port ${port}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()

// Add type declaration for user property on request
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string
    }
  }
}

export default app
