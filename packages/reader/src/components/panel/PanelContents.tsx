import { Col, Row } from '@style-kit-n/web'
import { ButtonSliderMenu } from '@/components/design-system/ButtonSliderMenu'
import { useEnhancementPanelState } from '@/hooks/useEnhancementPanelState'
import { EnhancementType } from '@lexome/core'
import { useSubscribedEnhancements } from '@/hooks/data/useSubscribedEnhancements'
import { useMemo } from 'react'
import { useBookMetadata } from '@/hooks/data/useBookMetadata'


type EnhancementTypeMenuSpec = {
  value: EnhancementType,
  label: string,
}[]

const enhancementTypeMenuSpec: EnhancementTypeMenuSpec = [
  { value: EnhancementType.Summary, label: 'Summary' },
]

const PanelMenu = () => {
  const { data: subscribedEnhancements } = useSubscribedEnhancements()

  const { data: bookMetadata } = useBookMetadata()

  const subscribedEnhancementTypeMenu = useMemo(() => {
    const types: EnhancementType[] = []

    for (const enhancement of subscribedEnhancements?.getSubscribedEnhancementsForBook ?? []) {
      types.push(...enhancement.includedTypes)
    }

    return enhancementTypeMenuSpec.filter((type) => types.includes(type.value))
  }, [subscribedEnhancements])

  const {
    selectedEnhancementType,
    setSelectedEnhancementType,
    selectedEnhancementData,
  } = useEnhancementPanelState()


  const handleChange = (value: string) => {
    setSelectedEnhancementType(value as EnhancementType)
  }

  console.log(selectedEnhancementData, 'selectedEnhancementData')

  return (
    <Row
      style={{
        width: '100%',
        alignItems: 'flex-start',
      }}
    >
      <ButtonSliderMenu
        value={selectedEnhancementType}
        options={subscribedEnhancementTypeMenu}
        onChange={(value) => {
          handleChange(value)
        }}
      />
    </Row>
  )
}


export const PanelContents = () => {
  return (
    <Col px={3} py={4}>
      <PanelMenu />
    </Col>
  )
}
