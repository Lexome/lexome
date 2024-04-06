import { RIGHT_PANEL_STATE, getRightPanelWidth, useRightPanel } from "@/hooks/usePanel"
import ePub, { Book, Rendition } from 'epubjs'
import { createContext, useContext, useEffect, useRef, useState } from "react"

const BookContext = createContext<{
  book?: Book,
  setBook: (book: Book) => void,
  rendition?: Rendition,
  setRendition: (rendition: Rendition) => void
}>({
  setBook: () => {},
  setRendition: () => {}
})

const getReaderDimensions = (params: {
  panelState: RIGHT_PANEL_STATE,
}) => {
  if (typeof window === 'undefined') return {
    width: 0,
    height: 0
  }

  const width = window.innerWidth
  const height = window.innerHeight

  const { panelState } = params

  const panelWidth = getRightPanelWidth({
    windowWidth: width,
    state: panelState,
  })

  return {
    width: Math.min(width - (panelWidth as number), 700),
    height: height - 60,
  }
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
  const [panelState, setPanelState] = useRightPanel()
  const [rendition, setRendition] = useState<Rendition | undefined>()

  const [selectedRange, setSelectedRange] = useState<string | undefined>()
  const [selectedParagraph, setSelectedParagraph] = useState<string | undefined>()

  const highlights = useRef<any[]>([])

  const debouncedSetPanelState = useRef(
    debounce(setPanelState, 1000)
  ).current

  useEffect(() => {
    // const el = document.getElementById("lexome_reader")
    const book = ePub("https://s3.amazonaws.com/moby-dick/OPS/package.opf"); 

    if (typeof window === 'undefined') return

    const readerDimensions = getReaderDimensions({
      panelState
    })

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
      // rendition.annotations.add('test', cfiRange)
      // contents.window.getSelection().removeAllRanges();

    });

    setBook(book)
    setRendition(rendition)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const readerDimensions = getReaderDimensions({
      panelState
    })

    if (rendition) {
      rendition.resize(readerDimensions.width, readerDimensions.height)
    }
  }, [panelState])

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