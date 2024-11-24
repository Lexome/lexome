import { styled } from '@/theme';
import { Button } from '@/components/design-system/Button'
import GoogleIcon from '@mui/icons-material/Google'
import { useState } from 'react';
import { LoadingSpinner } from './design-system/LoadingSpinner';
import { useListenForGoogleAuthToken } from '@/hooks/useSetGoogleAuthToken';
import { useLogInWithGoogle } from '@/hooks/data/useLogInWithGoogle';
import { useStoredValue } from '@/hooks/useStorage';
import { useSharedState } from '@/hooks/useSharedState';

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
  styles: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '500px',
    height: '600px',
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

export const LogInButton = ({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) => {
  const [waitingForAuth, setWaitingForAuth] = useState(false)
  const logInWithGoogle = useLogInWithGoogle()
  const [_, setJwtToken] = useStoredValue('jwtToken', '')
  const listenForGoogleAuthToken = useListenForGoogleAuthToken()

  const handleClick = async () => {
    setWaitingForAuth(true)
    oauthSignIn()
    const token = await listenForGoogleAuthToken()

    logInWithGoogle.mutate(token, {
      onSuccess: (data) => {
        const token = data.logInWithGoogle!.jwtToken
        setJwtToken(token)
        onLoginSuccess(token)
      }
    })
  }

  if (waitingForAuth) {
    return <LoadingSpinner />
  }

  return (
    <Button
      label="Sign in with Google"
      onClick={handleClick}
      leftIcon={GoogleIcon}
    />
  );
};

export const useLogInModalState = () => {
  const [isLoginModalOpen, setModalState] = useSharedState<boolean>('login-modal-state', false)
  return {
    isLoginModalOpen,
    openModal: () => setModalState(true),
    closeModal: () => setModalState(false)
  } as const
}

export const LogInModal = () => {
  const { isLoginModalOpen, closeModal } = useLogInModalState()

  if (!isLoginModalOpen) return null;

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
        <LogInButton onLoginSuccess={onLoginSuccess} />
      </ModalContent>
    </ModalOverlay>
  )
}

