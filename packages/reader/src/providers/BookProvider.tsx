import { EnhancementType } from '@lexome/core'

import { useBookAsset } from "@/hooks/data/useBookAsset"
import { useSubscribedEnhancements } from "@/hooks/data/useSubscribedEnhancements"
import { RIGHT_PANEL_STATE, getRightPanelWidth, useLeftPanel, useRightPanel } from "@/hooks/usePanel"
import { useQueryParams } from "@/hooks/useQueryParams"
import ePub, { Book, Rendition } from 'epubjs'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"

const MAX_READABLE_WIDTH = 650

type Enhancement = {
  id: string,
  type: EnhancementType,
}

const BookContext = createContext<{
  isLoading: boolean,
  book?: Book,
  setBook: (book: Book) => void,
  rendition?: Rendition,
  setRendition: (rendition: Rendition) => void,

}>({
  isLoading: true,
  setBook: () => {},
  setRendition: () => {}
})

const useReaderDimensions = () => {
  const [rightPanelState] = useRightPanel()
  const [leftPanelState] = useLeftPanel()

  if (typeof window === 'undefined') return {
    width: 0,
    height: 0
  }

  const width = window.innerWidth
  const height = window.innerHeight

  const panelWidth = getRightPanelWidth({
    windowWidth: width,
    rightPanelState,
    leftPanelState
  })

  return useMemo(() => ({
    width: Math.min(width - (panelWidth as number), MAX_READABLE_WIDTH),
    height: height - 60,
  }), [rightPanelState, leftPanelState])
}

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function(this: any, ...args: any[]) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), wait)
  }
}

type BookProviderProps = React.PropsWithChildren<{
  bookId: string
}>

export const BookProvider: React.FC<BookProviderProps> = ({children}) => {
  const { bookId } = useQueryParams()
  const {data: bookAsset, isLoading} = useBookAsset(bookId)

  const [book, setBook] = useState<Book | undefined>()
  const [_, setRightPanelState] = useRightPanel()
  const [rendition, setRendition] = useState<Rendition | undefined>()

  const {data: subscribedEnhancementsData} = useSubscribedEnhancements({
    bookId: bookId as string
  })

  const subscribedEnhancements = useMemo(() => {
    const subscribedEnhancements = subscribedEnhancementsData?.getSubscribedEnhancementsForBook || []
    return subscribedEnhancements.map((enhancement) => {
      const {coalescedData} = enhancement
      return JSON.parse(coalescedData)
    })
  }, [subscribedEnhancementsData])

  const readerDimensions = useReaderDimensions()

  const highlights = useRef<any[]>([])

  const debouncedSetPanelState = useRef(
    debounce(setRightPanelState, 1000)
  ).current

  useEffect(() => {
    // const el = document.getElementById("lexome_reader")
    if (!bookAsset) return

    const book = ePub(bookAsset); 

    if (typeof window === 'undefined') return

    const rendition = book.renderTo('lexome_reader', {
      ...readerDimensions,
      // flow: 'scrolled-doc'
    });

    rendition.themes.register("main",
      {
        "p": {
          "margin-top": "8px",
          "font-size": "18px",
          "line-height": "1.5",
          "color": '#555555',
        }
      }
    );
    rendition.themes.select("main");

    rendition.display();

    rendition.on("selected", async function(cfiRange: any, contents: any) {
      for (const highlight of highlights.current) {
        rendition.annotations.remove(highlight, 'underline')
      }

      highlights.current = [] 

      const range = await book.getRange(cfiRange)
      const parent = range.startContainer.parentElement;
      if (parent) {
        parent.className = "annotated-parent"
      }

      rendition.annotations.underline(cfiRange, {}, () => {
      }, 'test-underline');

      debouncedSetPanelState(RIGHT_PANEL_STATE.PARTIALLY_EXPANDED)

      highlights.current = [cfiRange]
    });

    setBook(book)
    setRendition(rendition)
  }, [bookAsset])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (rendition) {
      rendition.resize(readerDimensions.width, readerDimensions.height)
    }
  }, [readerDimensions])

  return (
    <BookContext.Provider
      value={{
        book,
        setBook,
        rendition,
        setRendition,
        isLoading
      }}
    >
      {children}
    </BookContext.Provider>
  )
}

export const useBook = () => {
  return useContext(BookContext)
}