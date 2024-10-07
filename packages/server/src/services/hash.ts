export type Hash = {
  prefixHash?: string;
  suffixHash?: string;
}

const HASH_LENGTH = 15

export enum HashBoundary {
  START = 'start',
  END = 'end'
}

export const hash = async (string: string): Promise<string> => {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

export const hashWords = async (params: {
  words: string[],
  boundary?: HashBoundary
}): Promise<string> => {
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

  return await hash(truncatedWords.join(' '))
}

export const prepareTextForHash = (params: {
  text: string
}): string[] => {
  const { text } = params
  const words = text.split(/[\s.,!?;:'"()\[\]{}<>—]+/u).filter(Boolean).map(word => word.toLowerCase());
  return words
}

export const createHashes = async (params: {
  text: string
}): Promise<Hash[]> => {
  const { text } = params
  const words = prepareTextForHash({ text });

  console.log(words)

  const hashes: Hash[] = [];

  for (let i = 0; i < words.length; i++) {
    const prefixHashStart = Math.max(i - 14, 0);
    const prefixHash = await hashWords({
      words: words.slice(prefixHashStart, i + 1),
    });

    const suffixHash = await hashWords({
      words: words.slice(i, i + 15),
    });

    hashes.push({ prefixHash, suffixHash });
  }

  return hashes;
}

