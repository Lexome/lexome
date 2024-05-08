const fs = require('fs')

// Regex that matches word chapter, followed by at most 5 non-whitespace characters
const chapterStartRegex = /^CHAPTER\s*\S{0,5}$/

const defaultIsChunkBreak = (line: string) => {
  return chapterStartRegex.test(line.trim().toUpperCase())
}

export const getBookChunks = (params: {
  bookLines: string[],
  isChunkBreak?: (line: string) => boolean
}) => {
  const {
    bookLines,
    isChunkBreak=defaultIsChunkBreak
  } = params
  const chunks = []
  let currentChunk: string[] = []

  for (const line of bookLines) {
    if (isChunkBreak(line)) {
      chunks.push(currentChunk.join('\n'))
      currentChunk = []
    } else {
      currentChunk.push(line)
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n'))
  }

  return chunks
}


export const parseBookIntoChunks = (
  bookContents: string,
) => {
  const lines = bookContents.split('\n')

  const chunks = getBookChunks({
    bookLines: lines
  })

  return chunks
}

export type ProcessChunk<ResponseType = any> = (params: {
  chunk: string,
  allChunks: string[],
  lastResponse: ResponseType | null,
}) => ResponseType

export const processBook = (params: {
  getBookContents: () => string,
  processChunk: ProcessChunk
}) => {
  const {
    getBookContents,
    processChunk
  } = params

  const bookContents = getBookContents()
  const chunks = parseBookIntoChunks(bookContents)

  let lastResponse = null

  for (const chunk of chunks) {
    lastResponse = processChunk({
      chunk,
      allChunks: chunks,
      lastResponse
    })
  }

  return lastResponse
}