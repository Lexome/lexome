import { STATE_KEY } from "@/constants"
import { useStorage, useStoredValue } from "./useStorage"
import { useSharedState } from "./useSharedState"
import { useEffect, useState } from "react"

const parseJwt = (jwt: string) => {
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

export const useJwt = () => {
  return useSharedState({
    key: STATE_KEY.JWT,
    initialValue: '',
    shouldSaveToStorage: true
  })
}

export const useAuthData = () => {
  const [jwt] = useJwt()

  if (jwt) {
    return parseJwt(jwt)
  }

  return null
}

export const useWatchForJwtInStorage = (params: {
  onReceiveJwt: (jwt: string) => void,
  watchImmediately?: boolean,
  watchInterval?: number
}) => {
  const { onReceiveJwt, watchImmediately = false, watchInterval = 1000 } = params

  const [, setJwt] = useJwt()
  const [isWatching, setIsWatching] = useState(watchImmediately)
  const storage = useStorage()

  useEffect(() => {
    if (!isWatching) return

    const interval = setInterval(() => {
      const jwt = storage.getStorageKey(STATE_KEY.JWT)

      if (jwt) {
        setJwt(jwt)
        onReceiveJwt(jwt)
      }
    }, watchInterval)

    return () => clearInterval(interval)
  }, [storage, isWatching, onReceiveJwt])

  return (isWatching: boolean) => {
    setIsWatching(isWatching)
  }
}

export const useAuthHeaders = (): {
  Authorization?: string
} => {
  const [jwt] = useJwt()

  if (!jwt) return {}

  return {
    Authorization: `Bearer ${jwt}`
  }
}