import { styled } from '@/theme';
import { MediaBreakpoint } from '@style-kit-n/core'

export const Row = styled<{
  breakpoint?: MediaBreakpoint
}>('div', ({
  activeBreakpoints,
  breakpoint
}) => ({
  styles: {
    flexDirection: (!(breakpoint) || !activeBreakpoints || activeBreakpoints[breakpoint]) ? 'row' : 'column',
    display: 'flex'
  }
}))
