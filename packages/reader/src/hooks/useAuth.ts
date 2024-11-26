import { STATE_KEYS } from "@/stateKeys"
import { useStoredValue } from "./useStorage"

const parseJwtToken = (jwt: string) => {
  if (!jwt) return null

  try {
    const base64Payload = jwt.split('.')[1]
    const payload = Buffer.from(base64Payload, 'base64').toString('utf8')
    return JSON.parse(payload)
  } catch (error) {
    console.error('Error parsing JWT token:', error)
    return null
  }
}

export const useAuth = () => {
  const [jwtToken] = useStoredValue(STATE_KEYS.JWT_TOKEN, '')

  console.log(parseJwtToken(jwtToken), 'parsed jwt token')

  if (jwtToken) {
    return parseJwtToken(jwtToken)
  }

  return null
}
