import { theme } from "@/theme"

import { WebKitNProvider } from "@style-kit-n/web"
import React, { FC, PropsWithChildren } from "react"

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WebKitNProvider theme={theme}>
      {children}
    </WebKitNProvider>
  )
}

