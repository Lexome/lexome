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
      this.storage = window.sessionStorage || fallbackStorage
    } else {
      this.storage = fallbackStorage
    }
    this.prefix = prefix
  }

  getStorageKey(key: string) {
    return this.prefix ? `${this.prefix}-${key}` : key
  }

  getItem(key: string) {
    return this.storage.getItem(this.getStorageKey(key))
  }

  setItem(key: string, value: string) {
    this.storage.setItem(this.getStorageKey(key), value)
  }
}

export const useStorage = (prefix?: string) => {
  const storage = React.useMemo(() => {
    return new StorageAdaptor(prefix)
  }, [prefix])

  return storage
}