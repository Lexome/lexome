import { styled } from "@/theme"
import { Row } from "./Row"
import { COLOR } from "@/theme/colors"
import React from "react"

const SwitchContainer = styled(Row, {
  bg: COLOR.BACKGROUND_STRONG,
  styles: {
    display: 'flex',
    alignItems: 'center',
    width: '48px',
    height: '24px',
    borderRadius: '12px',
    border: '1px solid $colors$foregroundMedium',
    position: 'relative',
    cursor: 'pointer',
  }
})

const SwitchCircle = styled<{
  on: boolean
}>('div', ({ on }) => {
  return {
    bg: on ? COLOR.PRIMARY : COLOR.FOREGROUND_MEDIUM,
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    position: 'absolute',
    left: on ? 'calc(100% - 20px)' : '2px',
    transition: 'left 0.3s',
  }
})

const getGenericLabel = (params: {
  label: string
}) => {
  // if label ends in words "on" or "off", remove them
  const { label } = params

  if (label.toLowerCase().endsWith(' on')) {
    return label.slice(0, -3)
  }

  if (label.toLowerCase().endsWith(' off')) {
    return label.slice(0, -4)
  }

  return label
}

export const Switch: React.FC<{
  on: boolean,
  offLabel: string,
  onLabel: string,
  onChange: (checked: boolean) => void
}> = ({
  on,
  onChange,
  onLabel,
  offLabel
}) => {
  return (
    <Row>
      {on ? onLabel : offLabel}
      <SwitchContainer
        onClick={() => onChange(!on)}
        tabIndex={0}
        role="button"
        aria-label={`Toggle switch for ${getGenericLabel({ label: onLabel })}`}
      >
        <SwitchCircle on={on} />
      </SwitchContainer>
    </Row>
  )

}