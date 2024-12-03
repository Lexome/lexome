import { styled } from "@/theme";
import { Column } from "../design-system/Column";

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

export const StickyTopScrollable = styled(Column, {
  styles: {
    height: '100vh',
    width: '100%',
    overflow: 'auto',
  }
})

export const StickyTop = styled(Column, {
  styles: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    flexGrow: 0
  }
})

