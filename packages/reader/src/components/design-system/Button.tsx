import React from "react"
import { COLOR } from "@/theme/colors"
import { styled, theme } from "@/theme"
import { Row } from "./Row"
import { FONT_SIZE, FONT_WEIGHT } from "@/theme/font"
import { Icon } from "./Icon"

export enum BUTTON_TYPE {
  TEXT = 'text',
  FILLED = 'filled',
  OUTLINE = 'outline',
}

export enum BUTTON_SIZE {
  SM='SM',
  MD='MD',
  LG='LG'
}

const getButtonColor = (params: {
  buttonType: BUTTON_TYPE,
  disabled: boolean
}) => {
  const { buttonType, disabled } = params

  if (disabled) return COLOR.FOREGROUND_MEDIUM

  if (buttonType === BUTTON_TYPE.FILLED) return COLOR.PRIMARY

  return 'transparent'
}

const getButtonTextColor = (params: {
  buttonType: BUTTON_TYPE,
  disabled: boolean
}) => {
  const { buttonType, disabled } = params
  if (disabled) return COLOR.FOREGROUND_MEDIUM
  if (buttonType === BUTTON_TYPE.FILLED) return COLOR.BACKGROUND_STRONG
  return COLOR.PRIMARY
}

const ButtonContainer = styled<{
  buttonSize: BUTTON_SIZE,
  buttonType: BUTTON_TYPE,
  disabled: boolean
}>('button', ({
  buttonSize = BUTTON_SIZE.MD,
  buttonType = BUTTON_TYPE.FILLED,
  disabled = false
}) => {
  return {
    px: 3,
    py: buttonSize === BUTTON_SIZE.MD ? 2 : 1,
    fontSize: buttonSize === BUTTON_SIZE.MD ? FONT_SIZE.MS : FONT_SIZE.SM,
    bg: getButtonColor({ buttonType, disabled }),
    color: getButtonTextColor({ buttonType, disabled }),
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
  type?: BUTTON_TYPE,
  disabled?: boolean,
  icon?: React.FC<any>,
  leftIcon?: React.FC<any>,
  rightIcon?: React.FC<any>,
  size?: BUTTON_SIZE,
  style?: React.CSSProperties,
}> = ({
  onClick,
  label,
  type,
  icon,
  leftIcon,
  rightIcon,
  style,
  size,
  disabled = false
}) => {
  const iconSize = size === BUTTON_SIZE.MD ? FONT_SIZE.MD : FONT_SIZE.MS

  const textColor = getButtonTextColor({ buttonType: type || BUTTON_TYPE.FILLED, disabled })

  return (
    <ButtonContainer
      onClick={onClick}
      buttonType={type || BUTTON_TYPE.FILLED}
      buttonSize={size || BUTTON_SIZE.MD}
      disabled={disabled}
      fontWeight={FONT_WEIGHT.BOLD}
      style={style}
    >
      <Row>
        {leftIcon &&
          <Row mr={2}>
            <Icon size={iconSize} icon={leftIcon} color={textColor} />
          </Row>
        }
        {label}
        {rightIcon && 
          <Row ml={2}>
            <Icon size={iconSize} icon={rightIcon} color={textColor} />
          </Row>
        }
      </Row>
    </ButtonContainer>
  )
}
