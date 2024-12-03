import { STATE_KEY } from "@/constants"
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
  windowWidth: number,
}) => {
  const {
    rightPanelState,
    windowWidth
  } = params
 
  // Even if the panel is closed, the element is still in the DOM
  // and needs a width so it can be smoothly animated into the viewport
  if (
    rightPanelState === RIGHT_PANEL_STATE.CLOSED ||
    rightPanelState === RIGHT_PANEL_STATE.PARTIALLY_EXPANDED
  ) {
    return windowWidth > 1200 ? 500 : 400
  }

  if (
    rightPanelState === RIGHT_PANEL_STATE.FULLY_EXPANDED
  ) {
    return windowWidth - 300
  }

  if (rightPanelState === RIGHT_PANEL_STATE.FULLY_EXPANDED) {
    return windowWidth - 20
  }

  return 0
}


// Independent of actual px width, this function returns the space 
// that the right panel occupies in the viewport
// This will be zero if the panel is closed because the panel is 
// absolutely positioned (and mostly hidden) when closed
export const getRightPanelWidth = (params: {
  rightPanelState: RIGHT_PANEL_STATE,
  windowWidth: number,
}) => {
  const {
    rightPanelState,
    windowWidth
  } = params

  if (rightPanelState === RIGHT_PANEL_STATE.CLOSED) {
    return 0
  }

  if (rightPanelState === RIGHT_PANEL_STATE.PARTIALLY_EXPANDED) {
    return windowWidth > 1200 ? 500 : 400
  }

  if (rightPanelState === RIGHT_PANEL_STATE.FULLY_EXPANDED) {
    return windowWidth - 20
  }

  return 0
}

export const useRightPanel = () => {
  return useSharedState<RIGHT_PANEL_STATE>({
    key: STATE_KEY.RIGHT_PANEL,
    initialValue: RIGHT_PANEL_STATE.CLOSED
  })
}

export const useLeftPanel = () => {
  return useSharedState<LEFT_PANEL_STATE>({
    key: STATE_KEY.LEFT_PANEL,
    initialValue: LEFT_PANEL_STATE.CLOSED
  })
}
