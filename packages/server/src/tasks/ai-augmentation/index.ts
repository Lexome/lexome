import { createHashIndexForBook, sha256 } from "./createHashIndex";
import fs from 'fs'
import path from 'path'
import { PromptOutput, createCharacterGraph } from "./characterGraph";
import { processBook } from "./bookChunks";
import { cleanForAnalysis, cleanForHashing } from "./cleanText";

const PROCESSED_DIRECTORY = path.join(__dirname, '../processed')
const NEEDS_PROCESSING_DIRECTORY = path.join(__dirname, '../needs-processing')

// Returns starting position of series of word in longer series of words
// Or -1 if not found
const findWords = (wordListQuery: string[], wordList: string[]) => {
  for (let i = 0; i < wordList.length; i++) {
    let found = true
    for (let j = 0; j < wordListQuery.length; j++) {
      if (wordList[i + j] !== wordListQuery[j]) {
        found = false
        break
      }
    }

    if (found) {
      return i
    }
  }

  return -1
}

type Anchor = {
  word: string,
  prevHash?: string,
  nextHash?: string
}

const anchorAndMergeChunks = async () => {
  const files = fs.readdirSync(PROCESSED_DIRECTORY)

  let found = true
  let i = 1
  let mergedEvents: any[] = []

  while (found) {
    const eventsfileName = `pride_and_prejudice-${i}-characters.json`
    const chunkTextFileName = `pride_and_prejudice-chunk-${i}.txt`

    i++

    const eventsFile = files.find((file) => file.includes(eventsfileName))
    const chunkTextFile = files.find((file) => file.includes(chunkTextFileName))
    found = Boolean(eventsFile && chunkTextFile)

    if (eventsFile && chunkTextFile) {
      const eventsFileContents = fs.readFileSync(path.join(PROCESSED_DIRECTORY, eventsFile), 'utf8')
      const chunkTextFileContents = fs.readFileSync(path.join(PROCESSED_DIRECTORY, chunkTextFile), 'utf8')

      const parsed = JSON.parse(eventsFileContents) as PromptOutput
      const chunkText = chunkTextFileContents

      for (const event of parsed.events) {
        const reference = cleanForHashing(cleanForAnalysis(event.originalText || ''))
        const referenceWords = reference.split(' ')

        const chunkWords = chunkText.split(' ')

        const referencePosition = findWords(referenceWords, chunkWords)

        if (event.originalText && referencePosition > -1) {
          const previousWords = chunkWords.slice(Math.max(0, referencePosition - 15), referencePosition)
          const nextWords = chunkWords.slice(referencePosition, referencePosition + 15)

          const prevHash = await sha256(previousWords.join(' '))
          const nextHash = await sha256(nextWords.join(' '))

          mergedEvents.push({
            ...event,
            anchor: {
              word: chunkWords[referencePosition],
              prevHash,
              nextHash
            }
          })
        } else {
          if (event.originalText) {
            console.log('Could not find reference in chunk', reference, i)
          }
          // Otherwise, anchor the event to the end of the chunk and leave the nextHash empty
          const previousWords = chunkWords.slice(Math.max(0, chunkWords.length - 15), chunkWords.length)
          const prevHash = await sha256(previousWords.join(' '))
          mergedEvents.push({
            ...event,
            anchor: {
              word: chunkWords[chunkWords.length - 1],
              prevHash
            }
          })
        }
      }
    }
  }

  const writePath = path.join(PROCESSED_DIRECTORY, 'pride_and_prejudice-characters-merged.json')
  fs.writeFileSync(writePath, JSON.stringify({
    events: mergedEvents
  }, null, 2))
}

type ProcessFileCallback = (params: {
  fileName: string,
  fileContents: string
}) => void

const forEachFileToProcess = (callback: ProcessFileCallback) => {
  fs.readdir(NEEDS_PROCESSING_DIRECTORY, (err, files) => {
    if (err) {
      console.error(err)
      return
    }

    files.forEach((file) => {
      const fileName = file.split('.')[0]
      const bookContents = fs.readFileSync(path.join(NEEDS_PROCESSING_DIRECTORY, file), 'utf8')

      callback({
        fileName,
        fileContents: bookContents
      })
    })
  })
}

const generateHashIndex = () => {
  forEachFileToProcess(async ({ fileName, fileContents }) => {
    const hashIndex = await createHashIndexForBook({
      getBookContents: () => fileContents
    })

    let indexFileContents = ''
    hashIndex?.forEach((hash) => {
      indexFileContents += `${hash.word},${hash.prevHash},${hash.nextHash}\n`
    })

    const writeIndexPath = path.join(PROCESSED_DIRECTORY, `${fileName}-hash-index.csv`)

    fs.writeFileSync(writeIndexPath, indexFileContents)
  })
}

const generateCleanedChunkFiles = () => {
  forEachFileToProcess(({ fileName, fileContents }) => {
    processBook<string>({
      getBookContents: () => fileContents,
      saveAggregatedResponse: () => Promise.resolve(),
      processChunk: async ({ onProcessChunk, chunk, chunkIndex }) => {
        const cleaned = cleanForHashing(cleanForAnalysis(chunk))

        if (onProcessChunk) {
          onProcessChunk({
            chunk,
            chunkIndex,
            processed: cleaned
          })
        }

        return cleaned
      },
      onProcessChunk: async ({ chunk, chunkIndex, processed }) => {
        const writeChunkPath = path.join(PROCESSED_DIRECTORY, `${fileName}-chunk-${chunkIndex}.txt`)
        fs.writeFileSync(writeChunkPath, processed)
      }
    })
  })
}

const generateCharacterGraph = () => {
  forEachFileToProcess(({ fileName, fileContents }) => {
    const saveGraph = async (graph: any) => {
      const writeCharacterGraphPath = path.join(PROCESSED_DIRECTORY, `${fileName}-characters.json`)
      fs.writeFileSync(writeCharacterGraphPath, JSON.stringify(graph, null, 2))
    }

    const saveChunk = async (params: {
      processed: any,
      chunk: string,
      chunkIndex: number
    }) => {
      const writeCharacterGraphPath = path.join(PROCESSED_DIRECTORY, `${fileName}-${params.chunkIndex}-characters.json`)
      fs.writeFileSync(writeCharacterGraphPath, JSON.stringify(params.processed, null, 2))
    }

    createCharacterGraph({
      getBookContents: () => fileContents,
      saveAggregatedResponse: saveGraph,
      onProcessChunk: saveChunk
    })
  })
}

// generateCleanedChunkFiles()
anchorAndMergeChunks()
