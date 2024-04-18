import Head from 'next/head'
import React, { useEffect, useMemo } from 'react'
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

const LeftPanel = styled(
  'div',
  {
    styles: {
      position: 'fixed',
      backgroundColor: '#fafafa',
      height: 'calc(100vh)',
      boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.2)',
      top: 0,
      right: '100%',
      width: '300px'
    }
  }
)

const RightPanel = styled<{
  panelWidth: number
}>(
  'div',
  ({
    panelWidth
  }) => {
    return {
      styles: {
        position: 'fixed',
        backgroundColor: '#fafafa',
        height: 'calc(100vh)',
        boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.2)',
        top: 0,
        left: '100%',
        width: `${panelWidth}px`
      }
    }
  })

// const styles = stylex.create({
//   readerWrapperWidth: (width: number) => ({
//     width: `${width}px`
//   }),
//   closeDrawerBar: {
//     height: '100%',
//     width: '40px',
//     display: 'flex',
//     alignItems: 'center',
//   },
//   panel: {
//     position: 'fixed',
//     backgroundColor: '#fafafa',
//     height: 'calc(100vh)',
//     boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.2)',
//     top: 0,
//     left: '100%',
//     zIndex: 1
//   },
//   rightPanelWidth: (rightPanelWidth: number) => ({
//     width: `${rightPanelWidth}px`
//   }),
//   readerWrapper: {
//     display: 'flex',
//     height: 'calc(100vh - 60px)',
//     justifyContent: 'center',
//     overflowY: 'auto'
//   }
// });

// const ReaderWrapper = styled<{
//   leftPanelState: LEFT_PANEL_STATE,
//   rightPanelState: RIGHT_PANEL_STATE,
//   windowWidth: number
// }>('div', ({ leftPanelState, rightPanelState, windowWidth }) => {
//   const rightPanelWidth = getRightPanelWidth({
//     state: rightPanelState,
//     windowWidth: 500
//   })

//   let width = '0px'

//   if (
//     leftPanelState === LEFT_PANEL_STATE.CLOSED &&
//     rightPanelState === RIGHT_PANEL_STATE.CLOSED   
//   ) {
//     width = '100vw'
//   } else if (
//     leftPanelState === LEFT_PANEL_STATE.EXPANDED &&
//     rightPanelState === RIGHT_PANEL_STATE.CLOSED
//   ) {
//     width = `calc(100vw - 4
//   }
//   )

//   return {
//     styles: {

//       display: 'flex',
//       height: 'calc(100vh - 60px)',
//       justifyContent: 'center',
//       overflowY: 'auto'
//     }
//   }
// })

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

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.document.getElementById("right-panel")) return

    const el = window.document.getElementById("right-panel")!

    if (
      lastRightPanelState.current === RIGHT_PANEL_STATE.CLOSED &&
      rightPanelState === RIGHT_PANEL_STATE.PARTIALLY_EXPANDED
    ) {
      el.animate([
        { transform: "translateX(-48px)" },
        { transform: `translateX(-${rightPanelPx}px)` }
      ], {
        duration: 200,
        fill: 'forwards'
      })
    } else if (
      lastRightPanelState.current === RIGHT_PANEL_STATE.PARTIALLY_EXPANDED &&
      rightPanelState === RIGHT_PANEL_STATE.CLOSED
    ) {

      el.animate([
        { transform: `translateX(-${rightPanelPx}px)` },
        { transform: "translateX(-48px)" }
      ], {
        duration: 200,
        fill: 'forwards'
      })
    }

    lastRightPanelState.current = rightPanelState
  }, [rightPanelState])

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
      <RightPanel id='right-panel' panelWidth={rightPanelPx}>
        {rightPanelPx}
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
