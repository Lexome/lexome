import { theme } from "@/theme"

import { WebKitNProvider, WebTheme, createStyled } from "@style-kit-n/web"
import React, { FC, PropsWithChildren, useEffect, useRef } from "react"

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WebKitNProvider theme={theme}>
      {children}
    </WebKitNProvider>
  )
}

