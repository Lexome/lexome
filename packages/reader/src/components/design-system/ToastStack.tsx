import { useSharedState } from "@/hooks/useSharedState"
import { styled } from "@/theme"
import { Column } from "@/components/design-system/Column"
import { useEffect, useRef } from "react"
import { STATE_KEY } from "@/constants"

export const useToastStack = () => {
  const [toastStack, setToastStack] = useSharedState<string[]>({
    key: STATE_KEY.TOAST_STACK,
    initialValue: []
  })

  const addToast = (toast: string) => {
    setToastStack([...toastStack, toast])
  }
  const removeToast = (toast: string) => {
    setToastStack(toastStack.filter((t) => t !== toast))
  }
  return { toastStack, addToast, removeToast }
}

const ToastWrapper = styled(Column, {
  styles: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000
  }
})

export const ToastStack = () => {
  const { toastStack } = useToastStack()
  const ref = useRef<HTMLDivElement>(null)

  const numToasts = toastStack.length

  useEffect(() => {
    if (numToasts > 0) {
      if (ref.current) {
        const animation = ref.current.animate([
          { transform: `translateY(${(numToasts - 1) * -60}px)` },
          { transform: `translateY(${numToasts * -60}px)` }
        ], {
          duration: 300,
          easing: 'ease-out',
          fill: 'forwards'
        })
        animation.play()
      }
    }
  }, [numToasts])

  return (
    <ToastWrapper ref={ref}>
      {toastStack.map((toast) => (
        <div key={toast}>{toast}</div>
      ))}
    </ToastWrapper>
  )
}

export default ToastStack
