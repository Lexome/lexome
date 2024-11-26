import { styled } from "@/theme";
import { COLOR } from "@/theme/colors";
import { FONT_SIZE, FONT_WEIGHT, TYPOGRAPHY_TYPE } from "@/theme/font";
import { Row } from "@style-kit-n/web";
import { FC, PropsWithChildren } from "react";
import { Icon } from "../design-system/Icon";

export const Layout = styled('div', {
  styles: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
  }
})

export const Main = styled('main', {
  p: 4,
  styles: {
    flex: 1,
    overflow: 'auto',
    height: '100vh',
    position: 'relative',
  }
})

export const TopRightContent = styled('div', {
  styles: {
    position: 'absolute',
    top: 0,
    right: 0,
  }
})

const ReadableWidthWrapper = styled('div', {
  styles: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

const ReadableWidthChild = styled('div', {
  styles: {
    maxWidth: '1100px',
    width: '100%',
  }
})

export const ReadableWidth: FC<PropsWithChildren> = ({ children }) => (
  <ReadableWidthWrapper>
    <ReadableWidthChild>
      {children}
    </ReadableWidthChild>
  </ReadableWidthWrapper>
)

export const SideNav = styled('nav', {
  bg: COLOR.OFF_WHITE,
  styles: {
    width: '100px',
    height: '100vh',
    overflow: 'auto',
    boxShadow: '0 0 8px 0 rgba(0,0,0,0.1)',
    zIndex: 1
  }
})

export const NavTopItems = styled('div', {
  styles: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px'
  }
})

export type NavItemProps = {
  uri: string,
  label: string,
  icon: React.FC<any>
}

export const NavItemWrapper = styled<{
  isSelected: boolean
}>(
  'div',
  ({ isSelected }) => {
    return {
      color: COLOR.PRIMARY,
      mt: 5,
      fontSize: FONT_SIZE.LG,
      styles: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
      },
      hover: {
        styles: {
          transform: 'scale(1.05)'
        }
      }
    }
  }
)

export const NavItemText = styled<{
  isSelected?: boolean,
}>('span', ({ isSelected }) => {
  return {
    typography: TYPOGRAPHY_TYPE.TEXT_SMALL,
    fontWeight: FONT_WEIGHT.BOLD,
  }
})

export const NavItem: React.FC<{
  uri: string,
  label: string,
  icon: React.FC<any>,
  isSelected: boolean
}> = ({
  uri,
  label,
  icon,
  isSelected
}) => {
  return (
    <NavItemWrapper isSelected={isSelected}>
      <Icon icon={icon} color={COLOR.PRIMARY} size={FONT_SIZE.LG} />
      <Row mt={1}>
        <NavItemText isSelected={isSelected}>
          {label}  
        </NavItemText>
      </Row>
    </NavItemWrapper>
  )
}
