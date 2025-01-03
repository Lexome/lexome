import { EnhancementType, Enhancements } from '@lexome/core'

import { useBookAsset } from "@/hooks/data/useBookAsset"
import { useSubscribedEnhancements } from "@/hooks/data/useSubscribedEnhancements"
import { RIGHT_PANEL_STATE, getRightPanelWidth, useLeftPanel, useRightPanel } from "@/hooks/usePanel"
import { useQueryParams } from "@/hooks/useQueryParams"
import ePub, { Book, Rendition } from 'epubjs'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useBookMetadata } from '@/hooks/data/useBookMetadata'
import { useSharedState } from '@/hooks/useSharedState'
import { useFindTextInIndex } from '@/hooks/useFindTextInIndex'
import { useStylePreferences, COLOR_SCHEME_NAME } from '@/hooks/useStylePreferences'

const MAX_READABLE_WIDTH = 650

type Enhancement = {
  id: string,
  includedTypes: EnhancementType[],
  data: Partial<Enhancements>
}

const useFocusManager = (book: Book) => {
  const [focused, setFocused] = useSharedState<string | null>({
    key: 'highlights',
    initialValue: null
  })

  const focusNextSentence = () => {

  }

  const focusPreviousSentence = () => {

  }


  return {

  }
}

const BookContext = createContext<{
  isLoading: boolean,
  book?: Book,
  setBook: (book: Book) => void,
  rendition?: Rendition,
  subscribedEnhancements: Enhancement[],
  setRendition: (rendition: Rendition) => void,
}>({
  isLoading: true,
  setBook: () => {},
  setRendition: () => {},
  subscribedEnhancements: []
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
  const {data: bookAsset, isLoading} = useBookAsset()
  const {data: bookMetadata, isLoading: isBookMetadataLoading} = useBookMetadata()

  const hashIndex = bookMetadata?.hashIndex
  const [hashIndexStartCursor, setHashIndexStartCursor] = useSharedState<number>({
    key: 'hashIndexStartCursor',
    initialValue: 0
  })
  const [hashIndexEndCursor, setHashIndexEndCursor] = useSharedState<number>({
    key: 'hashIndexEndCursor',
    initialValue: 0
  })

  const {
    fontSize,
    colorScheme,
    fontFamily,
    setFontSize,
    setColorScheme,
    setFontFamily
  } = useStylePreferences()

  const findTextInIndex = useFindTextInIndex()

  const [book, setBook] = useState<Book | undefined>()
  const [_, setRightPanelState] = useRightPanel()
  const [rendition, setRendition] = useState<Rendition | undefined>()

  const {data: subscribedEnhancementsData} = useSubscribedEnhancements()

  const subscribedEnhancements: Enhancement[] = useMemo(() => {
    const subscribedEnhancements = subscribedEnhancementsData?.getSubscribedEnhancementsForBook || []
    return subscribedEnhancements.map((enhancement) => {
      const {
        coalescedData,
        includedTypes,
        id
      } = enhancement

      return {
        id,
        includedTypes,
        data: JSON.parse(coalescedData)
      }
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

    rendition.on('relocated', () => {
      const location = rendition?.location
      const contents: any = rendition.getContents()

      for (const content of contents) {
        let startRange = content.range(location.start.cfi);
        let endRange = content.range(location.end.cfi);

        if (startRange && endRange) {
          let range = document.createRange();
          range.setStart(startRange.startContainer, startRange.startOffset);
          range.setEnd(endRange.endContainer, endRange.endOffset);

          let visibleText = range.toString();
          console.log(visibleText, range)
          findTextInIndex(visibleText)
        }
      }
    })

    rendition.themes.register("main",
      {
        "p": {
          "margin-top": "9px",
          "font-size": "18px",
          "line-height": "1.4",
          "margin-bottom": "16px",
          "color": '#555555',
          "font-family": 'Inter, sans-serif',
          "text-align": "justify",
          "text-indent": "0"
        },
        "strong": {
          "font-weight": "bold",
          "font-family": 'Inter, sans-serif',
          "font-size": "18px",
          "font-variant": "normal",
          "text-transform": "uppercase",
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

      console.log(range, cfiRange, typeof cfiRange)

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
        subscribedEnhancements,
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