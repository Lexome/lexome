import LibraryIcon from '@mui/icons-material/AccountBalance'
import CollectionIcon from '@mui/icons-material/Bookmarks'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import { Row } from './design-system/Row'
import logo from '../../static/logo.svg'
import { COLOR } from '@/theme/colors'
import { styled } from '@/theme'
import { FONT_SIZE, FONT_WEIGHT, TYPOGRAPHY_TYPE } from '@/theme/font'
import { Icon } from './design-system/Icon'

export const SideNavContainer = styled('nav', {
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
      borderColor: COLOR.PRIMARY,
      pb: 1,
      styles: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        borderBottom: isSelected ? `2px solid`: 'none',
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
  isSelected: boolean,
  onClick: () => void
}> = ({
  uri,
  label,
  icon,
  isSelected,
  onClick
}) => {
  return (
    <NavItemWrapper isSelected={isSelected} onClick={onClick}>
      <Icon
        icon={icon}
        color={COLOR.PRIMARY}
        size={FONT_SIZE.LG}
      />
      <Row mt={1}>
        <NavItemText>
          {label}  
        </NavItemText>
      </Row>
    </NavItemWrapper>
  )
}

const navItems = [
  {
    uri: '/',
    label: 'Library',
    icon: LibraryIcon,
    isSelected: true
  },
  {
    uri: '/collection',
    label: 'Collection',
    icon: CollectionIcon,
    isSelected: false
  },
  {
    uri: '/reader',
    label: 'Reader',
    icon: AutoStoriesIcon,
    isSelected: false
  }
]

export const SideNav = () => {
  const { pathname } = window.location

  const statefulNavItems = navItems.map(item => ({
    ...item,
    isSelected: pathname === item.uri
  }))

  return (
    <SideNavContainer>
      <NavTopItems>
        <Row
          mt={3}
          style={{
            height: '48px',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            src={logo.src}
            style={{
              height: '48px',
              width: '48px'
            }}
          />
        </Row>
        {statefulNavItems.map((item) => (
          <NavItem
            key={item.uri}
            uri={item.uri}
            label={item.label}
            icon={item.icon}
            isSelected={item.isSelected}
            onClick={() => {
              window.location.href = item.uri
            }}
          />
        ))}
      </NavTopItems>
    </SideNavContainer>
  )
}

