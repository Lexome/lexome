import React from "react"
import { COLOR } from "@/theme/colors"
import { styled, theme } from "@/theme"
import { Row } from "./Row"
import { FONT_SIZE, FONT_WEIGHT } from "@/theme/font"
import { Icon } from "./Icon"

export enum BUTTON_TYPE {
  TEXT = 'text',
  FILLED = 'filled',
  OUTLINE = 'outline'
}

export enum BUTTON_SIZE {
  SM='SM',
  MD='MD'
}

const ButtonContainer = styled<{
  buttonSize: BUTTON_SIZE,
  buttonType: BUTTON_TYPE,
}>('button', ({
  buttonSize = BUTTON_SIZE.MD,
  buttonType = BUTTON_TYPE.FILLED,
}) => {
  console.log('buttonType', buttonType)
  return {
    px: buttonSize === BUTTON_SIZE.MD ? 4 : 3,
    py: buttonSize === BUTTON_SIZE.MD ? 2 : 1,
    fontSize: buttonSize === BUTTON_SIZE.MD ? FONT_SIZE.MS : FONT_SIZE.SM,
    bg: buttonType === BUTTON_TYPE.FILLED ? COLOR.PRIMARY : 'transparent',
    color: buttonType === BUTTON_TYPE.FILLED ? COLOR.WHITE : COLOR.PRIMARY,
    styles: {
      border: buttonType === BUTTON_TYPE.OUTLINE ? `1px solid ${theme.colors[COLOR.PRIMARY]}` : 'none',
      borderRadius: '4px'
    },
    hover: {
      styles: {
        transform: 'scale(1.03)'
      }
    }
  }
})

export const Button: React.FC<{
  onClick: () => void,
  label: string,
  type?: BUTTON_TYPE
  icon?: React.FC<any>,
  leftIcon?: React.FC<any>,
  rightIcon?: React.FC<any>,
  size?: BUTTON_SIZE,
  style?: React.CSSProperties
}> = ({
  onClick,
  label,
  type,
  icon,
  leftIcon,
  rightIcon,
  style,
  size
}) => {
  const iconSize = size === BUTTON_SIZE.MD ? FONT_SIZE.MD : FONT_SIZE.MS

  return (
    <ButtonContainer
      onClick={onClick}
      buttonType={type || BUTTON_TYPE.FILLED}
      buttonSize={size || BUTTON_SIZE.MD}
      fontWeight={FONT_WEIGHT.BOLD}
      style={style}
    >
      <Row>
        {leftIcon &&
          <Row mr={2}>
            <Icon size={iconSize} icon={leftIcon} />
          </Row>
        }
        {label}
        {rightIcon && 
          <Row ml={2}>
            <Icon size={iconSize} icon={rightIcon} />
          </Row>
        }
      </Row>
    </ButtonContainer>
  )
}
