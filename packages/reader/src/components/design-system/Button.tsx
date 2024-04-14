import React from "react"
import { COLOR } from "@/theme/colors"
import { styled } from "@/theme"
import { Row } from "./Row"

export enum BUTTON_TYPE {
  TEXT = 'text',
  FILLED = 'filled',
}

export enum BUTTON_SIZE {
  SM='SM',
  MD='MD'
}

const ButtonContainer = styled<{
  size: BUTTON_SIZE,
  type: BUTTON_TYPE,
}>('button', ({
  size = BUTTON_SIZE.MD, type = BUTTON_TYPE.FILLED}) => ({
  px: size === BUTTON_SIZE.MD ? 4 : 2,
  py: size === BUTTON_SIZE.MD ? 2 : 1,
  backgroundColor: type === BUTTON_TYPE.FILLED ? COLOR.PRIMARY : 'transparent',
}))

export const Button: React.FC<{
  onClick: () => void,
  label: string,
  type?: BUTTON_TYPE
  icon?: React.FC<any>,
  leftIcon?: React.FC<any>,
  rightIcon?: React.FC<any>,
  buttonSize?: BUTTON_SIZE
}> = ({
  onClick,
  label,
  type,
  icon,
  leftIcon,
  rightIcon,
  buttonSize
}) => {
  const LeftIcon = leftIcon
  const RightIcon = rightIcon

  return (
    <ButtonContainer
      onClick={onClick}
      type={type || BUTTON_TYPE.FILLED}
      size={buttonSize || BUTTON_SIZE.MD}
    >
      <Row>
        {LeftIcon &&
          <Row mr={2}>
            <LeftIcon />
          </Row>
        }
        {label}
        {RightIcon && 
          <Row ml={2}>
            <RightIcon />
          </Row>
        }
      </Row>
    </ButtonContainer>
  )
}
