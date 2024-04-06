// Should mask hydration errors by always rendering null

import { useEffect, useState } from "react"

// on first render
export const DynamicContent: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    setShouldRender(true)
  })

  if (shouldRender) {
    return <>{children}</>
  }

  return null
}