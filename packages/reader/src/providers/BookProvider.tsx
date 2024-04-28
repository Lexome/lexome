import { LEFT_PANEL_STATE, RIGHT_PANEL_STATE, getRightPanelWidth, useLeftPanel, useRightPanel } from "@/hooks/usePanel"
import ePub, { Book, Rendition } from 'epubjs'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"

const BookContext = createContext<{
  book?: Book,
  setBook: (book: Book) => void,
  rendition?: Rendition,
  setRendition: (rendition: Rendition) => void
}>({
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
    width: Math.min(width - (panelWidth as number), 700),
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

export const BookProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [book, setBook] = useState<Book | undefined>()
  const [_, setRightPanelState] = useRightPanel()
  const [rendition, setRendition] = useState<Rendition | undefined>()

  // const [selectedRange, setSelectedRange] = useState<string | undefined>()
  // const [selectedParagraph, setSelectedParagraph] = useState<string | undefined>()

  const readerDimensions = useReaderDimensions()

  const highlights = useRef<any[]>([])

  const debouncedSetPanelState = useRef(
    debounce(setRightPanelState, 1000)
  ).current

  useEffect(() => {
    // const el = document.getElementById("lexome_reader")
    const book = ePub("https://s3.amazonaws.com/moby-dick/OPS/package.opf"); 

    if (typeof window === 'undefined') return

    const rendition = book.renderTo('lexome_reader', {
      ...readerDimensions,
      // flow: 'scrolled-doc'
    });

    rendition.display();

    rendition.on("selected", async function(cfiRange: any, contents: any) {
      console.log('highlights', highlights)

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
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (rendition) {
      rendition.resize(readerDimensions.width, readerDimensions.height)
    }
  }, [readerDimensions])

  return (
    <BookContext.Provider value={{
      book,
      setBook,
      rendition,
      setRendition
    }}>
      {children}
    </BookContext.Provider>
  )
}

export const useBook = () => {
  return useContext(BookContext)
}