import { styled } from "@/theme"
import { COLOR } from "@/theme/colors"
import React, { CSSProperties, FC, PropsWithChildren } from "react"
import { Icon } from "../Icon"
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from "@/theme/font"

export enum INPUT_SIZE {
  MD = 'MD',
  LG = 'LG'
}

export enum MASK_TYPE {
  TEL = 'tel',
  EMAIL = 'email',
  TEXT = 'text',
  CODE = 'code'
}

type TextInputProps = {
  placeholder: string,
  value: string,
  onChange: (value: string) => void,
  leftIcon?: React.FC<any>,
  style?: CSSProperties,
  size?: INPUT_SIZE,
  label?: string,
  maskType?: MASK_TYPE
}

export const isValidPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.length === 10
}

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const BaseInput = styled<{
  size: INPUT_SIZE,
  value: string,
  placeholder: string,
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

const formatValue = (params: {
  value: string,
  maskType: MASK_TYPE
}) => {
  const { value, maskType } = params

  switch (maskType) {
    case MASK_TYPE.TEL:
      // Remove non-digits
      const digitsOnly = value.replace(/\D/g, '');
      // Format as (XXX) XXX-XXXX
      if (digitsOnly.length <= 3) return digitsOnly;
      if (digitsOnly.length <= 6) return `(${digitsOnly.slice(0,3)}) ${digitsOnly.slice(3)}`;
      return `(${digitsOnly.slice(0,3)}) ${digitsOnly.slice(3,6)}-${digitsOnly.slice(6,10)}`;
    
    case MASK_TYPE.EMAIL:
      // Remove spaces
      return value.replace(/\s/g, '');

    case MASK_TYPE.CODE:
      // Replace all non-alphanumeric characters with empty string and limit to 6 characters
      return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);

    default:
      return value;
  }
}

const unformatValue = (params: {
  value: string,
  maskType: MASK_TYPE
}) => {
  const { value, maskType } = params

  switch (maskType) {
    case MASK_TYPE.TEL:
      return value.replace(/\D/g, '');

    case MASK_TYPE.EMAIL:
      return value.replace(/\s/g, '');

    case MASK_TYPE.CODE:
      return value.replace(/[^a-zA-Z0-9]/g, '');

    default:
      return value;
  }
}

const InputContainer = styled<{
  size: INPUT_SIZE,
}>('div', ({size}) => ({
  bg: COLOR.WHITE,
  p: size === INPUT_SIZE.MD ? 2 : 3,
  styles: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    border: `1px solid #cccccc`,
    borderRadius: 4,
  }
}))

const LabelText = styled<{
  size: INPUT_SIZE
}>('span', ({size}) => ({
  bg: COLOR.WHITE,
  px: 1,
  fontSize: size === INPUT_SIZE.MD ? FONT_SIZE.XS : FONT_SIZE.MS,
  fontFamily: FONT_FAMILY.SANS_SERIF,
  color: COLOR.GRAY,
  styles: {
    position: 'absolute',
    top: '-7px',
    left: '8px',
    letterSpacing: '0.5px',
  }
}))

export const TextInput: React.FC<TextInputProps> = ({
  leftIcon,
  onChange,
  value,
  placeholder,
  style,
  label,
  size = INPUT_SIZE.MD,
  maskType = MASK_TYPE.TEXT
}) => {
  return (
    <InputContainer style={style} size={size} mt={label ? 2 : 0}>
      {label && <LabelText size={size}>{label}</LabelText>}
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
        value={formatValue({ value, maskType })}
        placeholder={placeholder}
        onChange={(e: any) => {
          onChange(unformatValue({ value: e.target.value, maskType }))
        }}
      />
    </InputContainer>
  )
}