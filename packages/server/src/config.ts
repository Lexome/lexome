import dotenv from 'dotenv'

dotenv.config()

export const JWT_SECRET = process.env.JWT_SECRET
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
export const TWILIO_API_KEY = process.env.TWILIO_API_KEY
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+18438962394'
export const GMAIL_USER = process.env.GMAIL_USER || 'neal@lexome.com'
export const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "ogqdazxkcldukhbt"
export const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL || 'noreply@lexome.com'
export const LIVE_GOOGLE_CLIENT_ID = process.env.LIVE_GOOGLE_CLIENT_ID
export const DEV_GOOGLE_CLIENT_ID = process.env.DEV_GOOGLE_CLIENT_ID
