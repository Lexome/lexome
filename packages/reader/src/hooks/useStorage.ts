import React from 'react'

const fallbackMemory: {
  [key: string]: string
} = {}

const isBrowser = typeof window !== 'undefined'
interface _Storage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

const fallbackStorage: _Storage = {
  getItem(key: string) {
    return fallbackMemory[key]
  },

  setItem(key: string, value: string) {
    fallbackMemory[key] = value
  },
}

class StorageAdaptor implements _Storage {
  prefix?: string
  storage: _Storage

  constructor(prefix?: string) {
    if (isBrowser) {
      this.storage = window.localStorage || fallbackStorage
    } else {
      this.storage = fallbackStorage
    }
    this.prefix = prefix
  }

  getStorageKey(key: string) {
    return this.prefix ? `${this.prefix}-${key}` : key
  }

  getItem(key: string) {
    const item = this.storage.getItem(this.getStorageKey(key))
    try {
      return item ? JSON.parse(item) : undefined
    } catch {
      return undefined
    }
  }

  setItem(key: string, value: any) {
    this.storage.setItem(this.getStorageKey(key), JSON.stringify(value))
  }
}

export const useStorage = (prefix?: string) => {
  const storage = React.useMemo(() => {
    return new StorageAdaptor(prefix)
  }, [prefix])

  return storage
}

export const useStoredValue = <V>(key: string, defaultValue: V) => {
  const storage = useStorage()
  const [value, setValue] = React.useState<V>(storage.getItem(key) || defaultValue)

  const set = (value: V) => {
    storage.setItem(key, value)
    setValue(value)
  }

  return [value, set] as const
}