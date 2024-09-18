import React, { use, useEffect, useState } from "react";

export const PreventSsr: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount(renderCount + 1);
  }, [])

  if (typeof window === 'undefined' || renderCount === 0) {
    return null
  }

  return <>{children}</>
}