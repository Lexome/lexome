import { useSharedState } from "./useSharedState"

export enum RIGHT_PANEL_STATE {
  CLOSED = 'CLOSED',
  PARTIALLY_EXPANDED = 'PARTIALLY_EXPANDED',
  FULLY_EXPANDED = 'FULLY_EXPANDED'
}

export enum LEFT_PANEL_STATE {
  CLOSED = 'CLOSED',
  EXPANDED = 'EXPANDED'
}

export const getRightPanelPx = (params: {
  rightPanelState: RIGHT_PANEL_STATE,
  leftPanelState: LEFT_PANEL_STATE,
  windowWidth: number,
}) => {
  const {
    rightPanelState,
    leftPanelState,
    windowWidth
  } = params

  if (
    rightPanelState === RIGHT_PANEL_STATE.CLOSED ||
    rightPanelState === RIGHT_PANEL_STATE.PARTIALLY_EXPANDED
  ) {
    return windowWidth > 1200 ? 500 : 400
  }

  if (
    rightPanelState === RIGHT_PANEL_STATE.FULLY_EXPANDED &&
    leftPanelState === LEFT_PANEL_STATE.EXPANDED
  ) {
    return windowWidth - 300
  }

  if (rightPanelState === RIGHT_PANEL_STATE.FULLY_EXPANDED) {
    return windowWidth - 20
  }

  return 0
}


// Independent of actual px width, this function returns the space 
// that the right panel occupies in the viewport, after animations take place
export const getRightPanelWidth = (params: {
  rightPanelState: RIGHT_PANEL_STATE,
  leftPanelState: LEFT_PANEL_STATE,
  windowWidth: number,
}) => {
  const {
    rightPanelState,
    leftPanelState,
    windowWidth
  } = params

  if (rightPanelState === RIGHT_PANEL_STATE.CLOSED) {
    return 0
  }

  if (rightPanelState === RIGHT_PANEL_STATE.PARTIALLY_EXPANDED) {
    return windowWidth > 1200 ? 500 : 400
  }

  if (
    rightPanelState === RIGHT_PANEL_STATE.FULLY_EXPANDED &&
    leftPanelState === LEFT_PANEL_STATE.EXPANDED
  ) {
    return windowWidth - 300
  }

  if (rightPanelState === RIGHT_PANEL_STATE.FULLY_EXPANDED) {
    return windowWidth - 20
  }

  return 0
}

export const useRightPanel = () => {
  return useSharedState<RIGHT_PANEL_STATE>('right-panel', RIGHT_PANEL_STATE.CLOSED)
}

export const useLeftPanel = () => {
  return useSharedState<LEFT_PANEL_STATE>('left-panel', LEFT_PANEL_STATE.CLOSED)
}
