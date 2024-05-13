// Create an index for each word in the text, using the word and the 15 words
// that come after it and the word and 15 words that come before it.
// These indexes will be ordered in which they appear in the text.

import { ProcessChunk, processBook } from "./bookChunks"
import { cleanForAnalysis, cleanForHashing } from "./cleanText"
import crypto from 'crypto'

// async function sha256(message: string) {
//   const msgUint8 = new TextEncoder().encode(message)
//   const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
//   const hashArray = Array.from(new Uint8Array(hashBuffer))
//   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
//   return hashHex
// }

export async function sha256(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex.slice(0, 16)
}

const createIndexFromChunk: ProcessChunk<Hash[]> = async ({
  chunk,
  aggregatedResponse,
  onProcessChunk
}) => {
  let cleanedChunk = cleanForHashing(cleanForAnalysis(chunk))

  const words = cleanedChunk.split(' ')
  const priorHashes = aggregatedResponse ? aggregatedResponse : []
  const hashes: Hash[] = []

  for (let [index, word] of words.entries()) {
    const previousWords = words.slice(Math.max(0, index - 14), index + 1)
    const previousString = previousWords.join(' ')
    let prevHash = ''
    if (previousString) {
      prevHash = await sha256(previousString)
    }

    const nextWords = words.slice(index, index + 15)
    const nextString = nextWords.join(' ')
    let nextHash = ''
    if (nextString) {
      nextHash = await sha256(nextString)
    }

    hashes.push({
      word,
      prevHash: prevHash,
      nextHash: nextHash
    })
  }

  const processed = [...priorHashes, ...hashes]

  if (onProcessChunk) {
    onProcessChunk({
      processed,
      chunk,
      chunkIndex: 0
    })
  }

  return processed
}

type Hash = {
  word: string,
  prevHash?: string,
  nextHash?: string,
}

export const createHashIndexForBook = (params: {
  getBookContents: () => string
}) => {
  return processBook<Hash[]>({
    getBookContents: params.getBookContents,
    processChunk: createIndexFromChunk,
    saveAggregatedResponse: () => Promise.resolve(),
  })
}