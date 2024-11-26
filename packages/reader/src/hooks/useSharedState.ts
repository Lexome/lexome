import { RenderFunction, SharedStateContext } from "@/providers/SharedStateProvider"
import React, { useEffect } from "react"
import useForceRerender from "./utils/useForceRerender"
import { useStorage } from "./useStorage"

type PropertyPath = string | number | ((value: any) => any)

// Read a value from shared state
// Only rerenders when the value changes
export function useSharedStateSelector<T> (key: string, propertyPath: PropertyPath[]): T {
  const {
    read,
    write,
    watchForUpdates,
    endWatch
  } = React.useContext(SharedStateContext)

  const forceRerender = useForceRerender()

  const readValuePath = (value: any, propertyPath: PropertyPath[]) => {
    let val = value

    while (val && propertyPath.length > 0) {
      const property = propertyPath.shift()

      if (typeof property === 'function') {
        val = property(val)

      } else {
        try {
          val = val[property as keyof typeof val]
        } catch (e) {
          console.warn(`Invalid property path: ${propertyPath.join('.')}`)
          val = undefined
        }
      }
    }
  }

  useEffect(() => {
    const rerender: RenderFunction = ({ lastValue, newValue }) => {
      const lastValuePath = readValuePath(lastValue, propertyPath)
      const newValuePath = readValuePath(newValue, propertyPath)

      if (lastValuePath !== newValuePath) {
        forceRerender()
      }
    }

    watchForUpdates(key, rerender)

    return () => {
      endWatch(key, rerender)
    }
  }, [key, read])

  const val = read()[key]

  return readValuePath(val, propertyPath) as T
}

export function useSharedState<T> (params: {
  key: string,
  initialValue: T,
  shouldSaveToStorage?: boolean
}): [T, (value: T) => void] {
  const {
    key,
    initialValue,
    shouldSaveToStorage = false
  } = params

  const {
    read,
    write,
    watchForUpdates,
    endWatch
  } = React.useContext(SharedStateContext)

  const storage = useStorage()

  const forceRerender = useForceRerender()

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

    if (shouldSaveToStorage) {
      storage.setItem(key, value)
    }
  }

  const storedValue = shouldSaveToStorage ? storage.getItem(key) : undefined

  const val = read()[key] || storedValue || initialValue

  return [
    val as T,
    update
  ]
}
 