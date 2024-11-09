import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { HashBoundary, hashWords, prepareTextForHash } from "../../hash";
import { readChaptersForBook } from "../../processing/parseBooks";
import { audioPrompt, prompt, transcriptionPrompt } from "../../prompt";
import { initializeTempDirectory, saveLog, TEMP_DIRECTORY, uploadFileToS3 } from '../../../utils';
import { createChunkPipelineProcessor } from '../../processing/chunkPipelineProcessor';
import { EnhancementType } from "../../../generated/graphql"
import { prisma } from "../../../prisma"
import { createEnhancement } from "../core/createEnhancement"
import { buildEnhancementPatch } from "../core/buildEnhancementPatch"
import { addEnhancementPatch } from "../core/addEnhancementPatch"
import { Narration, NarrationSegment } from '../schemas/narration-v1';
import { breakChunkIntoProcessableSegments } from '../../processing/chunk';
import path from 'path';
import { updateEnhancementTypes } from '../core/updateEnhancementTypes';
import { BASIC_ENHANCEMENT_TITLE } from '../constants';

export const generateAudioNarration = async (params: {
  bookId: string,
  shouldSave?: boolean
}): Promise<Narration> => {
  initializeTempDirectory()

  const { shouldSave, bookId } = params

  const chapters = await readChaptersForBook({ bookId })

  console.log('chapters', chapters)

  const chunkPipelineProcessor = createChunkPipelineProcessor<Narration["chunks"]>({
    initialAggregate: [],
    chunkHandler: async ({
      chunk,
      chunkIndex,
      aggregate
    }) => {
      const processableSegments = breakChunkIntoProcessableSegments({
        chunk,
        wordLimit: 3000,
      })

      const narrationSegments: NarrationSegment[] = []

      for (const segment of processableSegments) {
        continue

        const audioBuffer = await audioPrompt({
          text: segment
        })

        const transcription = await transcriptionPrompt({
          audioBuffer
        })

        const segmentWords = prepareTextForHash({
          text: segment
        })

        const id = uuidv4()
        const saveKey = `${bookId}-${id}.mp3`

        const tempFile = path.join(TEMP_DIRECTORY, saveKey)

        fs.writeFileSync(tempFile, audioBuffer)

        // Upload file to S3
        const url = await uploadFileToS3({
          file: tempFile,
          bucket: 'audio-narration',
          key: saveKey
        })

        // fs.unlinkSync(tempFile)

        const { hashed: startOfSegmentHash, complete: isHashComplete } = await hashWords({
          words: segmentWords,
          boundary: HashBoundary.START
        })

        const narrationSegment: NarrationSegment = {
          anchor: {
            id: uuidv4(),
            word: segmentWords[0],
            suffixHash: startOfSegmentHash,
            suffixHashComplete: isHashComplete
          },
          timestamps: transcription,
          url
        }

        narrationSegments.push(narrationSegment)
      }

      return []

      const firstChunk = processableSegments[0]
      const chapterWords = prepareTextForHash({
        text: firstChunk
      })

      const { hashed: startOfChapterHash, complete: isHashComplete } = await hashWords({
        words: chapterWords,
        boundary: HashBoundary.START
      })

      return [
        ...aggregate,
        {
          id: uuidv4(),
          anchor: {
            id: uuidv4(),
            word: chapterWords[0],
            suffixHash: startOfChapterHash,
            suffixHashComplete: isHashComplete
          },
          segments: narrationSegments
        }
      ]
    }
  })

  const narration = await chunkPipelineProcessor(chapters)

  return {
    chunks: narration
  }

  if (process.env.DEBUG_MODE === 'true') {
    saveLog({
      message: {
        chunks: narration
      }
    })
  }

  if (shouldSave) {
    await addNarrationToBook({
      bookId,
      narration: {
        chunks: narration
      }
    })
  }

  return {
    chunks: narration
  }
}

export const addNarrationToBook = async (params: {
  bookId: string,
  narration: Narration
}) => {
  const { bookId, narration } = params

  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  })

  if (!book) {
    throw new Error('Book not found')
  }

  let enhancement = await prisma.enhancement.findFirst({
    where: {
      book_id: bookId,
    }
  })

  if (enhancement) {
    await updateEnhancementTypes({
      enhancement,
      types: [EnhancementType.Narration]
    })

  } else {
    enhancement = await createEnhancement({
      bookId,
      includedTypes: [EnhancementType.Narration],
      title: BASIC_ENHANCEMENT_TITLE,
    })
  }

  const patch = buildEnhancementPatch({
    enhancementType: EnhancementType.Summary,
    operation: {
      op: 'replace',
      value: narration.chunks,
    },
    path: ['chunks']
  })

  await addEnhancementPatch({
    enhancementId: enhancement.id,
    enhancementType: EnhancementType.Summary,
    patch,
    userId: 'SUPER_USER',
  })
}


