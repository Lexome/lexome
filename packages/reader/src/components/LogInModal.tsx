import { styled } from '@/theme';
import { Button, BUTTON_TYPE } from '@/components/design-system/Button'
import GoogleIcon from '@mui/icons-material/Google'
import React, { useState } from 'react';
import { CenterLoadingSpinner, LOADING_SPINNER_SIZE } from './design-system/LoadingSpinner';
import { useListenForGoogleAuthToken } from '@/hooks/useSetGoogleAuthToken';
import { useLogInWithGoogle } from '@/hooks/data/useLogInWithGoogle';
import { useSharedState } from '@/hooks/useSharedState';
import { useJwt, useWatchForJwtInStorage } from '@/hooks/useAuth';
import { STATE_KEY } from '@/constants';
import { INPUT_SIZE, isValidEmail, MASK_TYPE, TextInput } from './design-system/fields/TextInput';
import { Column } from './design-system/Column';
import { Text } from './design-system/Text';
import { COLOR } from '@/theme/colors';
import { FONT_WEIGHT, TYPOGRAPHY_TYPE } from '@/theme/font';
import { Row } from '@style-kit-n/web';
import { useCompleteEmailLogin, useLogInWithEmail } from '@/hooks/data/useLogInWithEmail';
import { useToastStack } from './design-system/ToastStack';

const ModalOverlay = styled('div', {
  styles: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  }
});

const ModalContent = styled('div', {
  w: '100%',
  px: 5,
  py: 4,
  styles: {
    maxWidth: '300px',
    background: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const GOOGLE_CLIENT_ID = '941682513344-qji0ep52vn1o82l6sv59n0ffc09kpqt8.apps.googleusercontent.com'
const GOOGLE_REDIRECT_URI = 'http://localhost:3000/login'

function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token

  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  const queryParams = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'token',
    scope: 'https://www.googleapis.com/auth/userinfo.email',
    include_granted_scopes: 'true',
  })

  const url = `${oauth2Endpoint}?${queryParams.toString()}`

  window.open(url, '_blank')?.focus()
}

export const Divider = styled('div', {
  bg: COLOR.LIGHT_GRAY,
  styles: {
    height: '1px',
    width: '100%',
  }
})

export const OrDivider = () => {
  return (
    <Row my={3} style={{ alignItems: 'center' }}>
      <Divider />
      <Text
        type={TYPOGRAPHY_TYPE.PARAGRAPH_SMALL}
        color={COLOR.GRAY}
        mx={2}
      >
        OR
      </Text>
      <Divider />
    </Row>
  )
}

export const LogInButton = ({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) => {
  const [waitingForAuth, setWaitingForAuth] = useState(false)
  const logInWithGoogle = useLogInWithGoogle()
  const [_, setJwt] = useJwt()

  const listenForGoogleAuthToken = useListenForGoogleAuthToken()

  const handleClick = async () => {
    setWaitingForAuth(true)
    oauthSignIn()
    const googleToken = await listenForGoogleAuthToken()

    logInWithGoogle.mutate(googleToken, {
      onSuccess: (data) => {
        const jwt = data.logInWithGoogle!.jwt
        setJwt(jwt)
        onLoginSuccess(jwt)
      }
    })
  }

  if (waitingForAuth) {
    return <CenterLoadingSpinner size={LOADING_SPINNER_SIZE.MD} />
  }

  return (
    <Button
      label="Sign in with Google"
      onClick={handleClick}
      leftIcon={GoogleIcon}
    />
  );
};

const ModalButtonGroupContainer = styled('div', {
  styles: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    marginTop: '16px'
  }
})

export const ModalButtonGroup = ({ children }: { children: React.ReactNode }) => {
  const childrenWithMargin = React.Children.map(children, (child, index) => {
    return React.cloneElement(child as React.ReactElement, {
      style: {
        marginLeft: '4px'
      }
    })
  })

  return (
    <ModalButtonGroupContainer>
      {childrenWithMargin}
    </ModalButtonGroupContainer>
  )
}

export const VerificationScreen = () => {
  const [code, setCode] = useState('')
  const { addToast } = useToastStack()

  const handleCancel = () => {
    // closeModal()
  }

  const handleVerify = () => {
    addToast('Verification successful')
  }

  return (
    <Column>
      <Row>
        <Text>You have been sent an email with a magic link that will log you in.</Text>
      </Row>
      <Row>
        <Text>Alternatively, you can enter the code you received here.</Text>
      </Row>
      <TextInput
        value={code}
        onChange={value => setCode(value)}
        maskType={MASK_TYPE.CODE}
        placeholder="999999"
        size={INPUT_SIZE.MD}
      />

      <ModalButtonGroup>
        <Button label="Cancel" onClick={handleCancel} type={BUTTON_TYPE.OUTLINE} />
        <Button label="Verify" onClick={handleVerify} type={BUTTON_TYPE.FILLED} />
      </ModalButtonGroup>
    </Column>
  )
}

export const useLogInModalState = () => {
  const [isLoginModalOpen, setModalState] = useSharedState({
    key: STATE_KEY.LOGIN_MODAL_STATE,
    initialValue: false
  })

  return {
    isLoginModalOpen,
    openModal: () => setModalState(true),
    closeModal: () => setModalState(false)
  } as const
}

export const LogInModal = () => {
  const { isLoginModalOpen, closeModal } = useLogInModalState()
  const [email, setEmail] = useState('')
  const [isVerificationScreenOpen, setIsVerificationScreenOpen] = useState(false)
  const logInWithEmail = useLogInWithEmail()
  const completeEmailLogin = useCompleteEmailLogin()

  const watchForJwtInStorage = useWatchForJwtInStorage({
    onReceiveJwt: (jwt) => {
      closeModal()
    }
  })

  if (!isLoginModalOpen) return null;

  const handleCancel = () => {
    closeModal()
  }

  const handleSubmit = () => {
    setIsVerificationScreenOpen(true)
    watchForJwtInStorage(true)
  }

  const handleOverlayClick = () => {
    closeModal();
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const onLoginSuccess = (token: string) => {
    closeModal()
  }

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={handleModalClick}>
        {isVerificationScreenOpen && (
          <VerificationScreen />
        )}

        {!isVerificationScreenOpen && (
          <Column style={{ width: '100%' }}>
            <Row style={{ justifyContent: 'center' }}>
              <Text typography={TYPOGRAPHY_TYPE.HEADLINE_LARGE} fontWeight={FONT_WEIGHT.NORMAL}>Log in</Text>
            </Row>
            <Row mt={3}>
              <LogInButton onLoginSuccess={onLoginSuccess} />
            </Row>
            <OrDivider />
            <Column style={{ width: '100%' }}>
              <TextInput
                label="Sign In With Email"
                placeholder="Enter Email"
                value={email}
                onChange={value => {
                  setEmail(value)
                }}
                maskType={MASK_TYPE.EMAIL}
                size={INPUT_SIZE.MD}
              />
              <ModalButtonGroup>
                <Button label="Cancel" onClick={handleCancel} type={BUTTON_TYPE.OUTLINE} />
                <Button
                  label="Submit"
                  onClick={handleSubmit}
                  type={BUTTON_TYPE.FILLED}
                  disabled={!isValidEmail(email)}
                />
              </ModalButtonGroup>
            </Column>
          </Column>
        )}
      </ModalContent>
    </ModalOverlay>
  )
}

