import Head from 'next/head'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Row } from '@style-kit-n/web'

import * as stylex from '@stylexjs/stylex';
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
      flexDirection: 'row'
    }
  }
)

const LeftPanelTouchContainer = styled(
  PanelTouchContainer,
  {
    styles: {
      right: '100%',
      width: '300px'
    }
  }
)

const LeftPanel = styled(
  Panel,
  {
    styles: {
      right: '100%',
      width: '300px'
    }
  }
)

const RightPanelTouchContainer = 
  styled<{
    panelWidth: number
  }>(
    'div',
    ({ panelWidth }) => ({
      styles: {
        width: `${panelWidth + 32}px`
      }
    })
  )

const RightPanel =
  styled<{
    panelWidth: number
  }>(
    Panel,
    ({
      panelWidth
    }) => {
      return {
        styles: {
          left: '100%',
          transform: 'translateX(-48px)',
          width: `${panelWidth}px`,
          touchAction: 'none'
        }
      }
    }
  )

const getReaderWidth = (params: {
  leftPanelState: LEFT_PANEL_STATE,
  rightPanelState: RIGHT_PANEL_STATE,
  windowWidth: number,
}) => {
  let width: number = params.windowWidth

  if (
    params.leftPanelState === LEFT_PANEL_STATE.EXPANDED
  ) {
    width -= 300
  }

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
  const [rightPanelState] = useRightPanel()
  const [leftPanelState] = useLeftPanel()

  const lastRightPanelState = React.useRef(rightPanelState)
  const lastLeftPanelState = React.useRef(leftPanelState)

  const rightPanelPx = useMemo(() => {
    if (typeof window === 'undefined') return 0

    return getRightPanelPx({
      rightPanelState,
      leftPanelState,
      windowWidth: window.innerWidth
    })
  }, [rightPanelState, leftPanelState])

  const panelAnimationState = useRef({
    [PANEL_ID.RIGHT]: -48,
    [PANEL_ID.LEFT]: 0
  })

  const lastDragStartRef = useRef<number | undefined>(undefined)

  const animateSlide = (params: {
    panelId: PANEL_ID,
    to: number,
  }) => {
    if (params.panelId === PANEL_ID.RIGHT) {
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
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.document.getElementById("right-panel")) return

    const el = window.document.getElementById("right-panel")!

    if (
      lastRightPanelState.current === RIGHT_PANEL_STATE.CLOSED &&
      rightPanelState === RIGHT_PANEL_STATE.PARTIALLY_EXPANDED
    ) {
      // el.animate([
      //   { transform: "translateX(-48px)" },
      //   { transform: `translateX(-${rightPanelPx}px)` }
      // ], {
      //   duration: 200,
      //   fill: 'forwards'
      // })
    } else if (
      lastRightPanelState.current === RIGHT_PANEL_STATE.PARTIALLY_EXPANDED &&
      rightPanelState === RIGHT_PANEL_STATE.CLOSED
    ) {

      // el.animate([
      //   { transform: `translateX(-${rightPanelPx}px)` },
      //   { transform: "translateX(-48px)" }
      // ], {
      //   duration: 200,
      //   fill: 'forwards'
      // })
    }

    lastRightPanelState.current = rightPanelState
  }, [rightPanelState])

  // Set the drag hook and define component movement based on gesture data.
  const getRightSliderProps = useDrag(({ down, movement: [mx, my] }) => {
    const reachedThreshold = Math.abs(mx) > 100

    let releaseDestination = -48

    if (reachedThreshold && mx > 0) {
      releaseDestination = -48
    } else if (reachedThreshold && mx < 0) {
      releaseDestination = -500
    }

    if (lastDragStartRef.current === undefined) {
      lastDragStartRef.current = panelAnimationState.current[PANEL_ID.RIGHT]
    }

    const lastDragStart = lastDragStartRef.current

    const animateTo = down ? Math.max(lastDragStart + mx, -500) : releaseDestination
    
    animateSlide({
      panelId: PANEL_ID.RIGHT,
      to: animateTo,
    })

    if (!down) {
      lastDragStartRef.current = undefined
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
    <Row>
      <LeftPanel id='left-panel' />
      <ReaderWrapper wrapperWidth={`${readerWidth}px`}>
        <div id="lexome_reader" />
      </ReaderWrapper>
      <RightPanel id='right-panel' panelWidth={rightPanelPx} {...getRightSliderProps()}>
        Hello world
      </RightPanel>
    </Row>
  )
}

const ControlPanel = () => {
  const { rendition } = useBook()
  const [ panelState, setPanelState ] = useRightPanel()

  return (
    <div
      style={{
        justifyContent: 'center',
        width: '100vw'
      }}
    >
      <div
        className='flex'
        style={{
          width: '500px'
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
    </div>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <DynamicContent>
          <BookProvider>
            <div>
              <Reader />
              <ControlPanel />
            </div>
          </BookProvider>
        </DynamicContent>
      </main>
    </>
  )
}
