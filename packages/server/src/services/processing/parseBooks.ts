import { ChunkMethod, chunkText } from "./chunk";
import { createHashes, type HashIndex, type Hash } from "../hash";
import { prisma } from "../../prisma";
import { readChaptersFromEpub } from "./readChaptersFromEpub";

export const createChapterChunks = (params: {
  chapters: string[];
  chunkMethod: ChunkMethod;
}): string[][] => {
  const { chapters, chunkMethod } = params;
  const chunks: string[][] = [];

  for (const chapter of chapters) {
    const chunksForChapter = chunkText({ text: chapter, method: chunkMethod });
    chunks.push(chunksForChapter);
  }

  return chunks;
}

export const createChapterHashes = async (params: {
  chapters: string[];
}) => {
  const { chapters } = params;
  const hashes: Hash[][] = [];

  for (const chapter of chapters) {
    const hashesForChapter = await createHashes({ text: chapter });
    hashes.push(hashesForChapter);
  }

  return hashes;
}

export const createOrderedHashForChapters = async (params: {
  chapters: string[]
}): Promise<HashIndex> => {
  const { chapters } = params;

  const prefixHashOrdering: {
    [key: string]: number[]
  } = {};
  const suffixHashOrdering: {
    [key: string]: number[]
  } = {};
  const hashArray: Hash[] = [];

  let startHashIndex = 0;
  let endHashIndex = 0;

  for (const chapter of chapters) {
    const hashes = await createHashes({ text: chapter });

    for (const hash of hashes) {
      if (hash.prefixHash) {
        if (!prefixHashOrdering[hash.prefixHash]) {
          prefixHashOrdering[hash.prefixHash] = [startHashIndex];
        } else {
          prefixHashOrdering[hash.prefixHash].push(startHashIndex);
        }
      }

      if (hash.suffixHash) {
        if (!suffixHashOrdering[hash.suffixHash]) {
          suffixHashOrdering[hash.suffixHash] = [endHashIndex];
        } else {
          suffixHashOrdering[hash.suffixHash].push(endHashIndex);
        }
      }
      hashArray.push(hash);

      startHashIndex += 1;
      endHashIndex += 1;
    }
  }

  return {
    prefixHashOrdering,
    suffixHashOrdering,
    hashArray,
  }
}

export const readChaptersForBook = async (params: {
  bookId: string;
}): Promise<string[]> => {
  const { bookId } = params;
  const book = await prisma.book.findUnique({
    where: {
      id: bookId
    }
  })

  if (!book) {
    throw new Error("Book not found");
  }

  if (!book.asset_url) {
    throw new Error("Book has no asset URL");
  }

  const chapters = await readChaptersFromEpub({
    epubUrl: book.asset_url
  })

  return chapters;
}

export const saveHashOrderingForBook = async (params: {
  bookId: string;
}): Promise<void> => {
  const { bookId } = params;
  const book = await prisma.book.findUnique({
    where: {
      id: bookId
    }
  })

  if (!book) {
    throw new Error("Book not found");
  }

  if (!book.asset_url) {
    throw new Error("Book has no asset URL");
  }

  const chapters = await readChaptersFromEpub({
    epubUrl: book.asset_url
  })

  const {
    prefixHashOrdering,
    suffixHashOrdering,
    hashArray,
  } = await createOrderedHashForChapters({ chapters });

  await prisma.book.update({
    where: {
      id: bookId
    },
    data: {
      hash_index: JSON.stringify({
        prefixHashOrdering: prefixHashOrdering,
        suffixHashOrdering: suffixHashOrdering,
        hashArray: hashArray,
      })
    }
  })
}