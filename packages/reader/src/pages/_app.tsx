import { SharedStateProvider } from '@/providers/SharedStateProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const client = new QueryClient()

  return (
    <QueryClientProvider client={client}>
      <SharedStateProvider>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </SharedStateProvider>
    </QueryClientProvider>
  )
}
