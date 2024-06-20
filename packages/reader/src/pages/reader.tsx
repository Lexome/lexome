import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Row } from '@style-kit-n/web'

import {
  LEFT_PANEL_STATE,
  RIGHT_PANEL_STATE,
  getRightPanelPx,
  getRightPanelWidth,
  useLeftPanel,
  useRightPanel
} from '@/hooks/usePanel'
import { BookProvider, useBook } from '@/providers/BookProvider'
import { Button, BUTTON_TYPE } from '../components/design-system/Button';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { DynamicContent } from '@/components/DynamicContent';
import { styled } from '@/theme';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

// const slideIn = stylex.keyframes({
//   '0%': {transform: 'translateX(0%)'},
//   '100%': {transform: 'translateX(-100%)'},
// });

// const fullSlideIn = stylex.keyframes({
//   '0%': {transform: 'translateX(-500px)'},
//   '100%': {transform: 'translateX(-100%)'},
// });

const RIGHT_LIP_WIDTH = 48
const LEFT_LIP_WIDTH = 48
const RIGHT_DRAG_TARGET_BUFFER = 48
const LEFT_DRAG_TARGET_BUFFER = 48

const ReaderWrapper = styled<{
  wrapperWidth: string
}>(
  'div',
  ({ wrapperWidth }) => ({
    styles: {
      display: 'flex',
      height: 'calc(100vh - 60px)',
      justifyContent: 'center',
      overflowY: 'auto',
      width: wrapperWidth
    }
  })
)

// Wrapper for touch action target for left and right panels
// Contains some padding to allow for easier touch target
const PanelTouchContainer = styled(
  'div',
  {
    styles: {
      position: 'fixed',
      backgroundColor: 'transparent',
      flexDirection: 'row',
      top: 0,
      display: 'flex',
      height: '100vh',
      zIndex: 1
    }
  }
)

const Panel = styled(
  'div',
  {
    styles: {
      backgroundColor: '#f5f5f5',
      height: '100vh',
      boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'row',
    }
  }
)

const LeftPanelTouchContainer = styled<{
  panelWidth: number
}>(
  PanelTouchContainer,
  ({ panelWidth }) => ({
    pr: 2,
    styles: {
      right: '100%',
      width: `${panelWidth + LEFT_DRAG_TARGET_BUFFER}px`,
      paddingRight: `${RIGHT_DRAG_TARGET_BUFFER}px`,
      transform: `translateX(${LEFT_DRAG_TARGET_BUFFER + LEFT_LIP_WIDTH}px)`,
      touchAction: 'none'
    }
  })
)

const LeftPanel = styled<{
  panelWidth: number
}>(
  Panel,
  ({ panelWidth }) => ({
    styles: {
      width: `${panelWidth}px`,
    }
  })
)

const RightPanelTouchContainer = styled<{
  panelWidth: number
}>(
  PanelTouchContainer,
  ({ panelWidth }) => ({
    styles: {
      width: `${panelWidth + RIGHT_DRAG_TARGET_BUFFER}px`,
      paddingLeft: `${RIGHT_DRAG_TARGET_BUFFER}px`,
      left: '100%',
      transform: `translateX(-${RIGHT_DRAG_TARGET_BUFFER + RIGHT_LIP_WIDTH}px)`,
      touchAction: 'none'
    }
  })
)

const RightPanel = styled<{
  panelWidth: number
}>(
  Panel,
  ({ panelWidth }) => ({
    styles: {
      width: `${panelWidth}px`,
    }
  })
)

const getReaderWidth = (params: {
  leftPanelState: LEFT_PANEL_STATE,
  rightPanelState: RIGHT_PANEL_STATE,
  windowWidth: number,
}) => {
  let width: number = params.windowWidth

  if (
    params.rightPanelState === RIGHT_PANEL_STATE.PARTIALLY_EXPANDED ||
    params.rightPanelState === RIGHT_PANEL_STATE.FULLY_EXPANDED
  ) {
    const rightPanelWidth = getRightPanelWidth({
      rightPanelState: params.rightPanelState,
      leftPanelState: params.leftPanelState,
      windowWidth: params.windowWidth
    })

    width -= rightPanelWidth
  }

  return width
}

enum PANEL_ID {
  RIGHT='right-panel',
  LEFT='left-panel'
}

const Reader = () => {
  const [rightPanelState, setRightPanelState] = useRightPanel()
  const [leftPanelState, setLeftPanelState] = useLeftPanel()

  const rightPanelPx = useMemo(() => {
    if (typeof window === 'undefined') return 0

    return getRightPanelPx({
      rightPanelState,
      leftPanelState,
      windowWidth: window.innerWidth
    })
  }, [rightPanelState, leftPanelState])

  const panelAnimationState = useRef({
    [PANEL_ID.RIGHT]: 0 - RIGHT_DRAG_TARGET_BUFFER - RIGHT_LIP_WIDTH,
    [PANEL_ID.LEFT]: LEFT_DRAG_TARGET_BUFFER + LEFT_LIP_WIDTH
  })


  const lastRightDragStartRef = useRef<number | undefined>(undefined)
  const lastLeftDragStartRef = useRef<number | undefined>(undefined)

  const animateSlide = (params: {
    panelId: PANEL_ID,
    to: number,
  }) => {
    const el = window.document.getElementById(params.panelId)

    if (el) {
      const lastState = panelAnimationState.current[params.panelId]

      el.animate([
        { transform: `translateX(${lastState}px)` },
        { transform: `translateX(${params.to}px)` }
      ], {
        duration: 100,
        fill: 'forwards'
      })

      panelAnimationState.current[params.panelId] = params.to
    }
  }

  useEffect(() => {
    if (rightPanelState === RIGHT_PANEL_STATE.CLOSED) {
      animateSlide({
        panelId: PANEL_ID.RIGHT,
        to: 0 - RIGHT_DRAG_TARGET_BUFFER - RIGHT_LIP_WIDTH
      })
    }

    if (rightPanelState === RIGHT_PANEL_STATE.PARTIALLY_EXPANDED) {
      animateSlide({
        panelId: PANEL_ID.RIGHT,
        to: -500
      })
    }
  }, [rightPanelState])

  useEffect(() => {
    if (leftPanelState === LEFT_PANEL_STATE.CLOSED) {
      animateSlide({
        panelId: PANEL_ID.LEFT,
        to: LEFT_DRAG_TARGET_BUFFER + LEFT_LIP_WIDTH
      })
    }

    if (leftPanelState === LEFT_PANEL_STATE.EXPANDED) {
      animateSlide({
        panelId: PANEL_ID.LEFT,
        to: 300
      })
    }
  }, [leftPanelState])

  const getLeftSliderProps = useDrag(({ down, movement: [mx] }) => {
    const reachedThreshold = Math.abs(mx) > 100

    if (lastLeftDragStartRef.current === undefined) {
      lastLeftDragStartRef.current = panelAnimationState.current[PANEL_ID.LEFT]
    }

    const lastDragStart = lastLeftDragStartRef.current

    if (down) {
      animateSlide({
        panelId: PANEL_ID.LEFT,
        to: Math.min(lastDragStart + mx, 300)
      })
    }

    if (!down) {
      lastLeftDragStartRef.current = undefined

      if (reachedThreshold && mx > 0) {
        setLeftPanelState(LEFT_PANEL_STATE.EXPANDED)
      } else if (reachedThreshold && mx < 0) {
        setLeftPanelState(LEFT_PANEL_STATE.CLOSED)
      } else if (leftPanelState === LEFT_PANEL_STATE.EXPANDED) {
        animateSlide({
          panelId: PANEL_ID.LEFT,
          to: 300
        })
      } else if (leftPanelState === LEFT_PANEL_STATE.CLOSED) {
        animateSlide({
          panelId: PANEL_ID.LEFT,
          to: LEFT_DRAG_TARGET_BUFFER + LEFT_LIP_WIDTH
        })
      }
    }
  })

  // Set the drag hook and define component movement based on gesture data.
  const getRightSliderProps = useDrag(({ down, movement: [mx] }) => {
    const reachedThreshold = Math.abs(mx) > 100

    if (lastRightDragStartRef.current === undefined) {
      lastRightDragStartRef.current = panelAnimationState.current[PANEL_ID.RIGHT]
    }

    const lastDragStart = lastRightDragStartRef.current

    if (down) {
      animateSlide({
        panelId: PANEL_ID.RIGHT,
        to: Math.max(lastDragStart + mx, -500),
      })
    }

    if (!down) {
      lastRightDragStartRef.current = undefined

      if (reachedThreshold && mx > 0) {
        setRightPanelState(RIGHT_PANEL_STATE.CLOSED)
      } else if (reachedThreshold && mx < 0) {
        setRightPanelState(RIGHT_PANEL_STATE.PARTIALLY_EXPANDED)
      } else if (rightPanelState === RIGHT_PANEL_STATE.PARTIALLY_EXPANDED) {
        animateSlide({
          panelId: PANEL_ID.RIGHT,
          to: -500
        })
      } else if (rightPanelState === RIGHT_PANEL_STATE.CLOSED) {
        animateSlide({
          panelId: PANEL_ID.RIGHT,
          to: 0 - RIGHT_DRAG_TARGET_BUFFER - RIGHT_LIP_WIDTH
        })
      }
    }

    // api.start({ x: down ? mx : 0, y: down ? my : 0 })
  })

  // Bind it to a component.
  const readerWidth = useMemo(() => {
    if (typeof window === 'undefined') return 0

    return getReaderWidth({
      rightPanelState,
      leftPanelState,
      windowWidth: window.innerWidth
    })
  }, [rightPanelState, leftPanelState])

  return (
    <ReaderContainer>
      <Row>
        <LeftPanelTouchContainer
          id='left-panel'
          panelWidth={300}
          {...getLeftSliderProps()}
        >
          <LeftPanel id='left-panel' panelWidth={300} />
        </LeftPanelTouchContainer>

        <ReaderWrapper wrapperWidth={`${readerWidth}px`}>
          <div id="lexome_reader" />
        </ReaderWrapper>

        <RightPanelTouchContainer
          id="right-panel"
          panelWidth={rightPanelPx}
          {...getRightSliderProps()}
        >
          <RightPanel panelWidth={rightPanelPx}>
            Hello world
          </RightPanel>
        </RightPanelTouchContainer>
      </Row>
      <ControlPanel />
    </ReaderContainer>
  )
}

const ReaderContainer = styled(
  'div',
  {
    styles: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      position: 'relative'
    }
  }
)

const ControlPanel = () => {
  const { rendition } = useBook()
  const [ panelState, setPanelState ] = useRightPanel()

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
        position: 'absolute',
        bottom: 0,
        height: '60px'
      }}
    >
      <Button
        onClick={() => {
          console.log("here!!! prev")
          rendition?.prev()
        }}
        label="Previous"
        type={BUTTON_TYPE.TEXT}
        leftIcon={ArrowBackIos}
      />
      <Button
        onClick={() => {
          if (
            panelState === RIGHT_PANEL_STATE.PARTIALLY_EXPANDED
          ) {
            setPanelState(RIGHT_PANEL_STATE.CLOSED)
            // setPanelState(PANEL_STATE.FULLY_EXPANDED)
          // } else if (panelState === PANEL_STATE.FULLY_EXPANDED) {
            // setPanelState(PANEL_STATE.CLOSED)
          } else {
            // setPanelState(PANEL_STATE.CLOSED)
            setPanelState(RIGHT_PANEL_STATE.PARTIALLY_EXPANDED)
          }
        }}
        label="Test"
      />
      <Button
        label="Next"
        type={BUTTON_TYPE.TEXT}
        rightIcon={ArrowForwardIosIcon}
        onClick={() => {
          rendition?.next()
        }}
      />
    </div>
  )
}

const PageWrapper = styled('main', {
  styles: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '100vh',
    width: '100vw'
  }
})

export default function Home() {
  return (
    <>
      <main>
        <DynamicContent>
          <BookProvider>
            <Reader />
          </BookProvider>
        </DynamicContent>
      </main>
    </>
  )
}
