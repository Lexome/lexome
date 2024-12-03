import { styled } from "@/theme"
import { CenterInSpace } from "./CenterInSpace"
import { useEffect, useRef } from "react"

export enum LOADING_SPINNER_SIZE {
  SM = 'sm',
  MD = 'md',
  LG = 'lg'
}

const getSizePx = (size: LOADING_SPINNER_SIZE) => {
  switch (size) {
    case LOADING_SPINNER_SIZE.SM: return '32px'
    case LOADING_SPINNER_SIZE.MD: return '48px'
    case LOADING_SPINNER_SIZE.LG: return '64px'
  }
}

const getSpinnerBorderWidth = (size: LOADING_SPINNER_SIZE) => {
  switch (size) {
    case LOADING_SPINNER_SIZE.SM: return '4px'
    case LOADING_SPINNER_SIZE.MD: return '5px'
    case LOADING_SPINNER_SIZE.LG: return '7px'
  }
}

const SpinnerContainer = styled<{
  spinnerSize?: LOADING_SPINNER_SIZE
}>('div', ({ spinnerSize }) => {
  const size = spinnerSize || LOADING_SPINNER_SIZE.MD
  const sizePx = getSizePx(size)
  const borderWidth = getSpinnerBorderWidth(size)

  return {
    styles: {
      display: 'inline-block',
      width: sizePx,
      height: sizePx,
      border: `${borderWidth} solid #f3f3f3`,
      borderTop: `${borderWidth} solid #3498db`,
      borderRadius: '50%',
    }
  }
})

export const LoadingSpinner: React.FC<{
  size?: LOADING_SPINNER_SIZE
}> = ({ size }) => {
  const spinnerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const spinAnimation = [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(360deg)' }
    ]
    
    const spinTiming = {
      duration: 1000,
      iterations: Infinity
    }

    spinnerRef.current?.animate(spinAnimation, spinTiming)
  }, [])

  return (
    <SpinnerContainer ref={spinnerRef} spinnerSize={size} />
  )
}

export const CenterLoadingSpinner: React.FC<{
  size?: LOADING_SPINNER_SIZE
}> = ({ size }) => {
  return (
    <CenterInSpace>
      <LoadingSpinner size={size} />
    </CenterInSpace>
  )
}
