import nodemailer from 'nodemailer';
import {
  GMAIL_APP_PASSWORD,
  GMAIL_USER,
  DEFAULT_FROM_EMAIL
} from '../config';

export const sendEmail = async (params: {
  to: string,
  from?: string,
  subject: string
  message: string
}) => {
  const { to, subject, message } = params

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD
    }
  });

  const mailOptions = {
    from: DEFAULT_FROM_EMAIL,
    to,
    subject,
    text: message
  };

  const response: { ok: boolean } = await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        reject({ ok: false });
      } else {
        resolve({ ok: true });
      }
    });
  });

  if (!response.ok) {
    throw new Error('Failed to send email')
  }
}
