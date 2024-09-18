import { styled } from "@/theme";
import { COLOR } from "@/theme/colors";

export enum BUTTON_SLIDER_MENU_SIZE {
  SM="SM",
  MD="MD",
}

type ButtonSliderMenuProps = {
  size?: BUTTON_SLIDER_MENU_SIZE,
  options: {
    label: string,
    value: string
  }[]
  value: string
  onChange: (value: string) => void
}

const MenuWrapper = styled<{
  size: BUTTON_SLIDER_MENU_SIZE
}>('div', ({ size }) => {
  return {
    p: 1,
    styles: {
      flexDirection: 'row',
      border: '1px solid #d0d0d0',
      borderRadius: '8px',
    }
  }
})

const MenuButton = styled<{
  active: boolean
  size: BUTTON_SLIDER_MENU_SIZE
}>('button', ({ active, size }) => {
  return {
    py: 1,
    bg: active ? COLOR.PRIMARY : 'transparent',
    color: active ? COLOR.WHITE : COLOR.GRAY,
    styles: {
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: size === BUTTON_SLIDER_MENU_SIZE.SM ? '12px' : '14px',
      outline: 'none',
      display: 'inline-flex',
      justifyContent: 'center',
      width: '80px'
    }
  }
})

export const ButtonSliderMenu: React.FC<ButtonSliderMenuProps> = ({
  size = BUTTON_SLIDER_MENU_SIZE.MD,
  options,
  value,
  onChange
}) => {
  return (
    <MenuWrapper size={size}>
      {options.map((option) => (
        <MenuButton
          active={option.value === value}
          size={size}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </MenuButton>
      ))}
    </MenuWrapper>
  )
}