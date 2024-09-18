import { createHash } from 'crypto';

export type Hash = {
  prefixHash?: string;
  suffixHash?: string;
}

const HASH_LENGTH = 15

export enum HashBoundary {
  START = 'start',
  END = 'end'
}

export const hashWords = (params: {
  words: string[],
  boundary?: HashBoundary
}): string => {
  const { words, boundary=HashBoundary.START } = params

  let truncatedWords = words

  if (words.length > HASH_LENGTH) {
    if (boundary === HashBoundary.START) {
      // If the boundary is the start, we want to take the first 15 words
      truncatedWords = words.slice(0, 15)
    } else {
      // If the boundary is the end, we want to take the last 15 words
      truncatedWords = words.slice(-15)
    }
  }

  const hash = createHash('sha256').update(truncatedWords.join(' ')).digest('hex');
  return hash
}

export const prepareTextForHash = (params: {
  text: string
}): string[] => {
  const { text } = params
  const words = text.split(/[\s.,!?;:'"()\[\]{}<>—]+/u).filter(Boolean).map(word => word.toLowerCase());
  return words
}

export const createHashes = (params: {
  text: string
}): Hash[] => {
  const { text } = params
  const words = prepareTextForHash({ text });

  const hashes: Hash[] = [];

  for (let i = 0; i < words.length; i++) {
    const prefixHashStart = Math.max(i - 14, 0);
    const prefixHash = hashWords({
      words: words.slice(prefixHashStart, i + 1),
    });

    const suffixHash = hashWords({
      words: words.slice(i, i + 15),
    });

    hashes.push({ prefixHash, suffixHash });
  }

  return hashes;
}

