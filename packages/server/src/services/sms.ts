import { TWILIO_PHONE_NUMBER } from "../config"
import { twilio } from "../twilio"

export const sendSms = async (params: {
  phoneNumber: string
  message: string
}) => {
  const { phoneNumber, message } = params

  await twilio.messages.create({
    body: message,
    from: TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  })
}
