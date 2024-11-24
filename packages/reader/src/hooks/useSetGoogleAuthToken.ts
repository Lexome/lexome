const GOOGLE_AUTH_TOKEN_KEY = 'googleAccessToken'

const checkLocalStorage = () => {
  const token = localStorage.getItem(GOOGLE_AUTH_TOKEN_KEY)

  if (token) {
    return token
  }
}

export const useListenForGoogleAuthToken = () => {
  return () => {
    return new Promise<string>((resolve) => {
      let interval = setInterval(() => {
        const token = checkLocalStorage()
        if (token) {
          clearInterval(interval)
          resolve(token)
        }
      }, 1000)
    })
  }
}

export const useSetGoogleAuthToken = () => {
  const setGoogleAuthToken = (token: string) => {
    localStorage.setItem(GOOGLE_AUTH_TOKEN_KEY, token)
  }

  return setGoogleAuthToken
}
