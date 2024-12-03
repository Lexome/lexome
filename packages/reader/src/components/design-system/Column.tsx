import { styled } from '@/theme';

export const Column = styled('div', {
  styles: {
    flexDirection: 'column',
    display: 'flex'
  }
})

export type ColumnProps = React.ComponentProps<typeof Column>
