import { useEffect } from 'react'
import { styled } from '@/theme'
import { COLOR } from '@/theme/colors'
import { Row } from '@/components/design-system/Row'
import { useSetGoogleAuthToken } from '@/hooks/useSetGoogleAuthToken'
import { LoadingSpinner } from '@/components/design-system/LoadingSpinner'

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

  useEffect(() => {
    // if the url includes a token, then parse it and send it to the parent frame
    const url = new URL(window.location.href)

    if (url.hash) {
      const paramsString = url.hash.substring(1)
      const params = new URLSearchParams(paramsString)
      const token = params.get('access_token')
      if (token) {
        setGoogleAuthToken(token)
        window.close()
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
