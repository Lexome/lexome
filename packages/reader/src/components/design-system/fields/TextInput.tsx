import { styled } from "@/theme"
import { COLOR } from "@/theme/colors"
import React, { CSSProperties, FC, PropsWithChildren } from "react"
import { Icon } from "../Icon"
import { FONT_SIZE } from "@/theme/font"

export enum INPUT_SIZE {
  MD = 'MD',
  LG = 'LG'
}

type TextInputProps = {
  placeholder: string,
  value: string,
  onChange: (value: string) => void,
  leftIcon?: React.FC<any>,
  style: CSSProperties,
  size?: INPUT_SIZE
}

const BaseInput = styled<{
  size: INPUT_SIZE
}>('input', ({ size }) => ({
  bg: COLOR.TRANSPARENT,
  p: 1,
  styles: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: size === INPUT_SIZE.MD ? FONT_SIZE.MD : FONT_SIZE.LG,
  }
}))

const InputContainer = styled<{
  size: INPUT_SIZE
}>('div', ({size}) => ({
  fontSize: size === INPUT_SIZE.MD ? FONT_SIZE.MS : FONT_SIZE.MD,
  bg: COLOR.WHITE,
  styles: {
    display: 'flex',
    alignItems: 'center',
    border: `1px solid #cccccc`,
    borderRadius: 4,
    padding: size === INPUT_SIZE.MD ? 3 : 4,
  }
}))

export const TextInput: React.FC<TextInputProps> = ({
  leftIcon,
  onChange,
  value,
  placeholder,
  style,
  size = INPUT_SIZE.MD
}) => {
  return (
    <InputContainer style={style} size={size}>
      {leftIcon && (
        <Icon
          icon={leftIcon}
          size={FONT_SIZE.MD}
          color={COLOR.GRAY}
        />
      )}
      <BaseInput
        size={size}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e: any) => {
          onChange(e.target.value)
        }}
      />
    </InputContainer>
  )
}