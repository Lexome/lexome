import { styled } from "@/theme"
import { FC, PropsWithChildren } from "react"

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