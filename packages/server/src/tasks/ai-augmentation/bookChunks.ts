import { chapterStartRegex } from "./utils"

// Regex that matches word chapter, followed by at most 5 non-whitespace characters

const defaultIsChunkBreak = (line: string) => {
  return chapterStartRegex.test(line.trim().toUpperCase())
}

export const getBookChunks = (params: {
  bookLines: string[],
  isChunkBreak?: (line: string) => boolean,
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
      currentChunk = [line]
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

export type OnProcessChunk<ResponseType = any> = (params: {
  processed: ResponseType,
  chunk: string,
  chunkIndex: number
}) => Promise<void>

export type ProcessChunk<
  ResponseType = any,
> = (params: {
  chunk: string,
  chunkIndex: number,
  aggregatedResponse: ResponseType | null,
  onProcessChunk?: (params: {
    processed: ResponseType,
    chunk: string,
    chunkIndex: number
  }) => Promise<void>
}) => Promise<ResponseType>

export async function processBook<ResponseType = any>(params: {
  getBookContents: () => string,
  saveAggregatedResponse: (response: ResponseType) => Promise<void>,
  processChunk: ProcessChunk<ResponseType>,
  onProcessChunk?: OnProcessChunk<ResponseType> 
}) {
  const {
    getBookContents,
    processChunk,
    saveAggregatedResponse,
    onProcessChunk
  } = params

  const bookContents = getBookContents()
  const chunks = parseBookIntoChunks(bookContents)

  let aggregatedResponse: ResponseType | null = null

  // for (const [chunk, ] of unks) {
  for (const [chunkIndex, chunk] of chunks.entries()) {
    console.log('Processing chunk', chunkIndex)

    aggregatedResponse = await processChunk({
      chunk,
      chunkIndex,
      aggregatedResponse,
      onProcessChunk: params.onProcessChunk
    })
  }

  saveAggregatedResponse(aggregatedResponse as ResponseType)

  return aggregatedResponse
}