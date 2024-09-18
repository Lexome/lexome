
import React, { FC, PropsWithChildren, useRef } from "react"

type SharedState = {
  [key: string]: any
}

type SharedStateOperations = {
  read: () => SharedState,
  write: (key: string, value: any) => void,
  watchForUpdates: (key: string, subscription: Function) => void
  endWatch: (key: string, subscription: Function) => void
}

export const SharedStateContext = React.createContext<SharedStateOperations>({
  read: () => ({}),
  write: () => {},
  watchForUpdates: () => {},
  endWatch: () => {}
})

export const SharedStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const state = useRef<SharedState>({})
  const rerendersToTrigger = useRef<{
    [key: string]: Function[]
  }>({})

  function write<T = any>(key: string, value: T) {
    state.current[key] = value


    rerendersToTrigger.current[key]?.forEach((render) => {
      render()
    })
  }

  function read() {
    return state.current
  }

  // Adds rerender function to trigger when a key's value changes
  function watchForUpdates(key: string, rerenderFunction: Function) {
    if (!rerendersToTrigger.current[key]) {
      rerendersToTrigger.current[key] = []
    }
    rerendersToTrigger.current[key].push(rerenderFunction)
  }

  // Removes rerender function watched for a key
  function endWatch(key: string, rerenderFunction: Function) {
    rerendersToTrigger.current[key] =
      rerendersToTrigger.current[key].filter((s) => s !== rerenderFunction)
  }

  return (
    <SharedStateContext.Provider
      value={{
        read,
        write,
        watchForUpdates,
        endWatch
      }}
    >
      {children}
    </SharedStateContext.Provider>
  )
}

