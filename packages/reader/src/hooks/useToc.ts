import { useBook } from "@/providers/BookProvider";
import { useEffect, useState } from "react";

export type TocItem = {
  label: string,
  href: string,
  subitems?: Array<TocItem>
}

export const useToc = () => {
  const { book } = useBook()

  const [toc, setToc] = useState<Array<TocItem>>([])

  useEffect(() => {
    if (!book) return

    book.loaded.navigation.then((navigation) => {
      const toc = navigation.toc; // toc is an array of chapter objects

      const tocArray: Array<TocItem> = []

      // Recursive function to process TOC items and their subitems
      const processTocItem = (item: any): TocItem => {
        const processedItem: TocItem = {
          label: item.label,
          href: item.href,
        }

        if (item.subitems && item.subitems.length > 0) {
          processedItem.subitems = item.subitems.map((subitem: any) => processTocItem(subitem))
        }

        return processedItem
      }

      // Process each top-level chapter
      toc.forEach((chapter) => {
        tocArray.push(processTocItem(chapter))
      })

      setToc(tocArray)
    });
  }, [book]);

  return toc
}