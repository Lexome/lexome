import { useBook } from "@/providers/BookProvider"
import { useMemo } from "react"

export const useGetPageBounds = () => {
  const { rendition } = useBook()

  // Get the words on the current page

  return () => {
    if (!rendition) return []

    const wordsStart = rendition?.location.start.cfi
    const wordsEnd = rendition?.location.end.cfi

    const contents = rendition.getContents()
    // const range = contents.cfiRangeToDomRange(wordsStart, wordsEnd)
    // const text = range.toString()
     

  }





  // Get the bounds of the words

  return bounds
}