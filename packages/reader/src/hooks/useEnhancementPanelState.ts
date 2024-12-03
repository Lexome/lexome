import { EnhancementType } from '@lexome/core'
import { useSharedState } from './useSharedState'
import { useSubscribedEnhancements } from './data/useSubscribedEnhancements'
import { useEffect, useMemo } from 'react'
import { STATE_KEY } from '@/constants'

export enum BASIC_PANEL_MODE {
  CONTENTS = 'contents',
  SETTINGS = 'settings',
}

export type EnhancementPanelMode = EnhancementType | BASIC_PANEL_MODE

export const basicPanelModes = [
  BASIC_PANEL_MODE.CONTENTS,
  BASIC_PANEL_MODE.SETTINGS,
]

export type EnhancementTypeMenuSpec = {
  value: EnhancementPanelMode,
  label: string,
}[]

export const enhancementTypeMenuSpec: EnhancementTypeMenuSpec = [
  { value: BASIC_PANEL_MODE.CONTENTS, label: 'Contents' },
  { value: EnhancementType.Summary, label: 'Summary' },
]

export const useEnhancementPanelState = () => {
  const {data: subscribedEnhancments} = useSubscribedEnhancements()

  const [selectedEnhancementType, setSelectedEnhancementType] = useSharedState<EnhancementPanelMode>({
    key: STATE_KEY.ENHANCEMENT_PANEL_TYPE,
    initialValue: BASIC_PANEL_MODE.CONTENTS
  })

  const [selectedEnhancementId, setSelectedEnhancementId] = useSharedState<string>({
    key: STATE_KEY.ENHANCEMENT_PANEL_ID,
    initialValue: ''
  })

  useEffect(() => {
    if (!subscribedEnhancments || selectedEnhancementId) return

    if (subscribedEnhancments.getSubscribedEnhancementsForBook.length > 0) {
      setSelectedEnhancementId(subscribedEnhancments.getSubscribedEnhancementsForBook[0].id)
    }
  }, [subscribedEnhancments])

  const {
    selectedEnhancement,
    selectedEnhancementData
  } = useMemo(() => {
    if (!subscribedEnhancments) return {}

    const selectedEnhancement = subscribedEnhancments
      .getSubscribedEnhancementsForBook
      .find(enhancement => enhancement.id === selectedEnhancementId)

    const selectedEnhancementData = selectedEnhancement?.coalescedData
      ? JSON.parse(selectedEnhancement.coalescedData)
      : null

    return {
      selectedEnhancement,
      selectedEnhancementData,
    }
  }, [subscribedEnhancments, selectedEnhancementId])

  return {
    selectedEnhancementType,
    setSelectedEnhancementType,
    selectedEnhancementId,
    setSelectedEnhancementId,
    selectedEnhancement,
    selectedEnhancementData,
  } 
}