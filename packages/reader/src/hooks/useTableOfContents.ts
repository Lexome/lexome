import { useBook } from "@/providers/BookProvider"
import { useMemo } from "react"

export const useTableOfContents = () => {
  const { book } = useBook()

  const tableOfContents = useMemo(() => {
  }, [book])
}