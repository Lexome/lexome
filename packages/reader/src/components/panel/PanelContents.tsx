import { Col, Row } from '@style-kit-n/web'
import { ButtonSliderMenu } from '@/components/design-system/ButtonSliderMenu'
import { BASIC_PANEL_MODE, basicPanelModes, enhancementTypeMenuSpec, useEnhancementPanelState } from '@/hooks/useEnhancementPanelState'
import { EnhancementType } from '@lexome/core'
import { useSubscribedEnhancements } from '@/hooks/data/useSubscribedEnhancements'
import { useMemo } from 'react'
import { TableOfContents } from './table-of-contents'
import SettingsIcon from '@mui/icons-material/Settings'
import { Button } from '../design-system/Button'

const PanelMenu = () => {
  const { data: subscribedEnhancements } = useSubscribedEnhancements()
  // useGenerateDefaultDiscussionEnhancement()

  const subscribedEnhancementTypeMenu = useMemo(() => {
    const types: EnhancementType[] = []

    for (const enhancement of subscribedEnhancements?.getSubscribedEnhancementsForBook ?? []) {
      types.push(...enhancement.includedTypes)
    }

    return enhancementTypeMenuSpec
      .filter((type) => {
        if (types.includes(type.value as EnhancementType)) {
          return true
        }

        if (basicPanelModes.includes(type.value as BASIC_PANEL_MODE)) {
          return true
        }

        return false
      })
  }, [subscribedEnhancements])

  const {
    selectedEnhancementType,
    setSelectedEnhancementType,
    selectedEnhancementData,
  } = useEnhancementPanelState()


  const handleChange = (value: string) => {
    setSelectedEnhancementType(value as EnhancementType)
  }

  return (
    <Row style={{ width: '100%', justifyContent: 'space-between' }}>
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
      <Row>
        <Button
          leftIcon={SettingsIcon}
          onClick={() => {
            setSelectedEnhancementType(BASIC_PANEL_MODE.SETTINGS)
          }}
          label="Settings"
        />
      </Row>
    </Row>
  )
}


const PanelContentSwitch = () => {
  const { selectedEnhancementType } = useEnhancementPanelState()

  if (selectedEnhancementType === BASIC_PANEL_MODE.CONTENTS) {
    return <TableOfContents />
  }

  return null
}

export const PanelContents = () => {
  return (
    <Col px={3} py={4}>
      <PanelMenu />
      <PanelContentSwitch />
    </Col>
  )
}
