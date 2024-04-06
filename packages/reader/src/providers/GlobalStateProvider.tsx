
import React, { FC, PropsWithChildren, useEffect, useRef } from "react"

type GlobalState = {
  [key: string]: any
}

type GlobalStateOperations = {
  read: () => GlobalState,
  write: (key: string, value: any) => void,
  watchForUpdates: (key: string, subscription: Function) => void
  endWatch: (key: string, subscription: Function) => void
}

const GlobalStateContext = React.createContext<GlobalStateOperations>({
  read: () => ({}),
  write: () => {},
  watchForUpdates: () => {},
  endWatch: () => {}
})

export const GlobalStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const state = useRef<GlobalState>({})
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
    <GlobalStateContext.Provider
      value={{
        read,
        write,
        watchForUpdates,
        endWatch
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}

export function useSharedState<T> (key: string, initialValue: T): [T, (value: T) => void] {
  const {
    read,
    write,
    watchForUpdates,
    endWatch
  } = React.useContext(GlobalStateContext)

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
 