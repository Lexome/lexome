import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Row } from '@style-kit-n/web'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import LaunchIcon from '@mui/icons-material/Launch'
import { useDrag } from '@use-gesture/react';

import {
  RIGHT_PANEL_STATE,
  getRightPanelPx,
  getRightPanelWidth,
  useRightPanel
} from '@/hooks/usePanel'
import { BookProvider, useBook } from '@/providers/BookProvider'
import { Button, BUTTON_SIZE, BUTTON_TYPE } from '@/components/design-system/Button';
import { PanelContents } from '@/components/panel/PanelContents';
import { styled } from '@/theme';
import { useQueryParams } from '@/hooks/useQueryParams';
import { PreventSsr } from '@/components/PreventSsr';
import { COLOR } from '@/theme/colors';
import { Column } from '@/components/design-system/Column';

// const slideIn = stylex.keyframes({
//   '0%': {transform: 'translateX(0%)'},
//   '100%': {transform: 'translateX(-100%)'},
// });

// const fullSlideIn = stylex.keyframes({
//   '0%': {transform: 'translateX(-500px)'},
//   '100%': {transform: 'translateX(-100%)'},
// });

const RIGHT_LIP_WIDTH = 48
const RIGHT_DRAG_TARGET_BUFFER = 48

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
    bg: COLOR.OFF_WHITE,
    styles: {
      height: '100vh',
      boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'row',
    }
  }
)

const PanelLip = styled(
  Column, {
    bg: COLOR.FAINT_GRAY,
    styles: {
      width: `${RIGHT_LIP_WIDTH}px`,
      borderRight: `1px solid #eeeeee`,
      alignItems: 'center',
      justifyContent: 'center',
    }
  }
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
      windowWidth: params.windowWidth
    })

    width -= rightPanelWidth
  }

  return width
}

enum PANEL_ID {
  RIGHT='right-panel',
}

const Reader = () => {
  const [rightPanelState, setRightPanelState] = useRightPanel()

  const rightPanelPx = useMemo(() => {
    if (typeof window === 'undefined') return 0

    return getRightPanelPx({
      rightPanelState,
      windowWidth: window.innerWidth
    })
  }, [rightPanelState])

  const panelAnimationState = useRef({
    [PANEL_ID.RIGHT]: 0 - RIGHT_DRAG_TARGET_BUFFER - RIGHT_LIP_WIDTH,
  })

  const lastRightDragStartRef = useRef<number | undefined>(undefined)

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
      const rightPanelWidth = getRightPanelWidth({
        rightPanelState,
        windowWidth: window.innerWidth
      })

      animateSlide({
        panelId: PANEL_ID.RIGHT,
        to: 0 - rightPanelWidth
      })
    }
  }, [rightPanelState])

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
      windowWidth: window.innerWidth
    })
  }, [rightPanelState])

  return (
    <ReaderContainer>
      <Row>
        <ReaderWrapper wrapperWidth={`${readerWidth}px`}>
          <div id="lexome_reader" />
          <ControlPanel />
        </ReaderWrapper>

        <RightPanelTouchContainer
          id="right-panel"
          panelWidth={rightPanelPx}
          {...getRightSliderProps()}
        >
          <RightPanel panelWidth={rightPanelPx}>
            <PanelLip />
            <PanelContents />
          </RightPanel>
        </RightPanelTouchContainer>
      </Row>
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
    <Row
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        position: 'absolute',
        bottom: 0,
        height: '60px'
      }}
    >
      <Button
        onClick={() => {
          rendition?.prev()
        }}
        label="Previous"
        type={BUTTON_TYPE.TEXT}
        leftIcon={ArrowBackIos}
      />

      <Button
        label="Panel"
        type={BUTTON_TYPE.TEXT}
        size={BUTTON_SIZE.MD}
        leftIcon={LaunchIcon}
        onClick={() => {
          if (
            panelState === RIGHT_PANEL_STATE.PARTIALLY_EXPANDED
          ) {
            setPanelState(RIGHT_PANEL_STATE.CLOSED)
          } else {
            setPanelState(RIGHT_PANEL_STATE.PARTIALLY_EXPANDED)
          }
        }}
      />
      <Button
        label="Next"
        type={BUTTON_TYPE.TEXT}
        rightIcon={ArrowForwardIosIcon}
        onClick={() => {
          rendition?.next()
        }}
      />
    </Row>
  )
}

export default function() {
  const { bookId } = useQueryParams()

  return (
    <PreventSsr>
      <main>
        <BookProvider bookId={bookId || ''}>
          <Reader />
        </BookProvider>
      </main>
    </PreventSsr>
  )
}
