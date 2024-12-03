import Twilio from 'twilio'
import { TWILIO_ACCOUNT_SID, TWILIO_API_KEY } from './config'

export const twilio = Twilio(TWILIO_ACCOUNT_SID, TWILIO_API_KEY)
