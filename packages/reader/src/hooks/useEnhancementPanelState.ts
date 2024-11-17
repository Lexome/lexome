import { EnhancementType } from '@lexome/core'
import { useSharedState } from './useSharedState'
import { useSubscribedEnhancements } from './data/useSubscribedEnhancements'
import { useEffect, useMemo } from 'react'

export const useEnhancementPanelState = () => {
  const {data: subscribedEnhancments} = useSubscribedEnhancements()

  const [selectedEnhancementType, setSelectedEnhancementType] = useSharedState<EnhancementType>(
    'enhancement-panel-type',
    EnhancementType.Summary
  )

  const [selectedEnhancementId, setSelectedEnhancementId] = useSharedState<string>(
    'enhancement-panel-id',
    ''
  )

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

    console.log(selectedEnhancement, 'selectedEnhancement')

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