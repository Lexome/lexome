import { sendEmail } from "../services/email"
import { twilio } from "../twilio"

const testEmail = async () => {
  try {
    const message = await sendEmail({
      to: 'neal@lexome.com',
      subject: 'Hello, world!',
      message: 'Hello, world!',
    })

    console.log(message)
  } catch (error) {
    console.error(error)
  }
}

export default testEmail
