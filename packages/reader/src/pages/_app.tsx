import { GlobalStateProvider } from '@/providers/GlobalStateProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalStateProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </GlobalStateProvider>
  )
}
