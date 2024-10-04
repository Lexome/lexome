import React from "react"

const useForceRerender = () => {
  const [
    renderCount, // eslint-disable-line @typescript-eslint/no-unused-vars
    setRenderCount
  ] = React.useState(0)

  const forceRerender = () => setRenderCount(value => value + 1)
  
  return forceRerender
}

export default useForceRerender