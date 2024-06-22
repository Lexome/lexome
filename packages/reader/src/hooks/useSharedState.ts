import { SharedStateContext } from "@/providers/SharedStateProvider"
import React, { useEffect } from "react"

export function useSharedState<T> (key: string, initialValue: T): [T, (value: T) => void] {
  const {
    read,
    write,
    watchForUpdates,
    endWatch
  } = React.useContext(SharedStateContext)

  // Support manual rerendering
  const [
    renderCount, // eslint-disable-line @typescript-eslint/no-unused-vars
    setRenderCount 
  ] = React.useState(0)

  const forceRerender = () => setRenderCount(value => value + 1)

  useEffect(() => {
    const rerender = () => {
      forceRerender()
    }

    watchForUpdates(key, rerender)

    return () => {
      endWatch(key, rerender)
    }
  })

  const update = (value: T) => {
    write(key, value)
  }

  const val = read()[key] || initialValue

  return [
    val as T,
    update
  ]
}
 