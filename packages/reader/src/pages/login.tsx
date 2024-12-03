import { useEffect } from 'react'
import { styled } from '@/theme'
import { COLOR } from '@/theme/colors'
import { Row } from '@/components/design-system/Row'
import { useSetGoogleAuthToken } from '@/hooks/useSetGoogleAuthToken'
import { LoadingSpinner } from '@/components/design-system/LoadingSpinner'
import { useCompleteEmailLogin } from '@/hooks/data/useLogInWithEmail'
import { useSharedState } from '@/hooks/useSharedState'
import { STATE_KEY } from '@/constants'

const Container = styled('div', {
  styles: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: COLOR.WHITE,
    padding: '20px'
  }
})

const LogInPage = () => {
  const setGoogleAuthToken = useSetGoogleAuthToken()
  const completeEmailLogin = useCompleteEmailLogin()
  const [logInRedirectPath] = useSharedState({
    key: STATE_KEY.LOG_IN_REDIRECT_PATH,
    shouldSaveToStorage: true,
    initialValue: '/'
  })

  useEffect(() => {
    // if the url includes a token, then parse it and send it to the parent frame
    const fn = async () => {
      const url = new URL(window.location.href)

      if (url.hash) {
        const paramsString = url.hash.substring(1)
        const params = new URLSearchParams(paramsString)

        const token = params.get('google_access_token')
        if (token) {
          setGoogleAuthToken(token)
          window.close()
        }

        const verificationCode = params.get('verification_code')
        const email = params.get('email')
        if (verificationCode && email) {
          const result = await completeEmailLogin.mutateAsync({
            email: email,
            code: verificationCode
          })

          if (result.data?.success) {


          }
        }
      }
    }
  }, [])

  return (
    <Container>
      <Row>
        <LoadingSpinner />
      </Row>
    </Container>
  )
}

export default LogInPage
