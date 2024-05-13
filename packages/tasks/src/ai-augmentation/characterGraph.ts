import { prompt } from "./api"
import { OnProcessChunk, ProcessChunk, processBook } from "./bookChunks"
import { cleanForAnalysis } from "./cleanText"
import { chapterStartRegex } from "./utils"

type CharacterNode = {
  characterId: string
}

type CharacteristicType = 'APPEARANCE' | 'PERSONALITY' | 'NAMES'

type CharacteristicNode = {
  characteristicId: string,
  characterId: string,
  info: string,
  characteristicType?: CharacteristicType,
}

type RelationshipNode = {
  characterIds: string[],
  info: string
}

type CharacterGraph = {
  characters: {
    [id: string]: CharacterNode
  },
  characteristics: {
    [id: string]: CharacteristicNode
  },
  relationships: RelationshipNode[]
}

const systemPrompt = `
   You are an automated character graph generator. Given an excerpt from a book, you will generate a character graph
   of the characters, their characteristics, and their relationships.

   You can capture this information by emitting new events. Here are the events you can emit:

   ADD_CHARACTER: Add a new character to the graph
   Example: {
    type: 'ADD_CHARACTER',
    characterId: 'john_doe',
   }

  ADD_CHARACTERISTIC: Add a new characteristic to a character
  Example: {
    type: 'ADD_CHARACTERISTIC',
    characteristicId: 'john_doe_1',
    characteristicType: 'APPEARANCE',
    characterId: 'john_doe',
    originalText: 'John was tall, dark, and handsome',
    info: 'Tall, dark, and handsome'
  }

  ADD_RELATIONSHIP: Add a relationship between two characters. You can use $TO to refer to the toCharacterId in the info field
  Example: {
    type: 'ADD_RELATIONSHIP',
    characterIds: ['john_doe', 'jane_smith'],
    originalText: 'John was married to Jane',
    info: 'John and Jane are married.'
  }

  MODIFY_CHARACTERISTIC: Modify an existing characteristic
  Example: {
    type: 'MODIFY_CHARACTERISTIC',
    characteristicId: 'john_doe_1'
    originalText: 'John's face was severely scarred the accident.',
    info: 'Tall with dark features. His once-handsome face now has severe scarring from a recent accident'
  }

  MODIFY_RELATIONSHIP: Modify an existing relationship
  Example: {
    type: 'MODIFY_RELATIONSHIP',
    characterIds: [
      'john_doe',
      'jane_smith'
    ],
    originalText: 'Jane is now divorced from John',
    info: 'Jane is divorced from John. They have two children together.'
  }

  Whenever a characteristic or relationship is modified or added, the original excerpt from the 
  text that describes the characteristic or relationship should be included in the event as "originalText".

  When a new relationship is added, it is identified by the characterIds of the two characters in the relationship. If it not a symmetric relationship, the character names should be included in the 
  "info" field.

  Only major, long-term character relationships should be added to the graph. Do not add ephemeral situations as relationships.

  If applicable, ADD_CHARACTERISTIC event should have a field "characteristicType" if the characteristic
  is one of the following types of information:
  APPEARANCE -- Physical appearance of the character
  PERSONALITY -- Character's personality traits
  NAMES -- Names the character goes by. This should be a comma-separated list of names if the character goes by multiple names

  Make sure to capture personality traits about the character whenever they are known.

  Whenever a character is added to the graph, at least one corresponding characteristic should
  be added to name the character, unless the character's name is unknown.

  Each character node should only refer to a single character. Only add a new character node if the character is a specific person, not a generic group or reference.
`

const generateUserPrompt = (params: {
  characterGraph: CharacterGraph | null,
  bookChunk: string
}) => {
  const {characterGraph, bookChunk} = params

  const existingGraphInstructions = characterGraph
   ? `
    You have already started a character graph from previous exerpts. This is the
    existing graph, in JSON format.
    
    ${JSON.stringify(characterGraph)}

    Do not add new characters that are shown in the existing graph. If a new characteristic
    is learned about an existing character, add a new characteristic event to the graph.
   `
   : `
     You have not yet started building a new character graph yet. Any characters, characteristics, and relationships
     you add will added to a new graph.
   `

  return `
    This is the book excerpt you will be processing:
    ${params.bookChunk}

    ${existingGraphInstructions}

    Generate an JSON object with one key: "events". The value of events should be an array
    of events to emit, in the format demonstrated above. If no character changes are
    present in the excerpt, emit an empty array.
  `
}

type GraphMutation = {
  type: 'ADD_CHARACTER',
  originalText?: string,
  characterId: string,
} | {
  type: 'ADD_CHARACTERISTIC',
  originalText?: string,
  characteristicId: string,
  characterId: string,
  characteristicType?: CharacteristicType,
  info: string,
} | {
  type: 'ADD_RELATIONSHIP',
  originalText?: string,
  characterIds: string[],
  info: string,
} | {
  type: 'MODIFY_CHARACTERISTIC',
  originalText?: string,
  characteristicId: string,
  info: string,
} | {
  type: 'MODIFY_RELATIONSHIP',
  originalText?: string,
  characterIds: string[],
  info: string,
}

export type PromptOutput = {
  events: GraphMutation[]
}

const mergeEventsIntoGraph = (events: GraphMutation[]): CharacterGraph => {
  const newGraph: CharacterGraph = {
    characters: {},
    characteristics: {},
    relationships: []
  }

  for (const event of events) {
    switch (event.type) {
      case 'ADD_CHARACTER':
        newGraph.characters[event.characterId] = {
          characterId: event.characterId,
        }
        break
      case 'ADD_CHARACTERISTIC':
        newGraph.characteristics[event.characteristicId] = {
          characteristicId: event.characteristicId,
          characterId: event.characterId,
          characteristicType: event.characteristicType,
          info: event.info
        }
        break
      case 'ADD_RELATIONSHIP':
        newGraph.relationships.push({
          characterIds: [...event.characterIds],
          info: event.info
        })
        break
      case 'MODIFY_CHARACTERISTIC':
        newGraph.characteristics[event.characteristicId].info = event.info
        break
      case 'MODIFY_RELATIONSHIP':
        for (const [relationshipIndex, relationship] of newGraph.relationships.entries()) {
          if (
            relationship.characterIds.length === event.characterIds.length &&
            relationship.characterIds.every(id => event.characterIds.includes(id))
          ) {
            newGraph.relationships[relationshipIndex] = {
              ...relationship,
              info: event.info
            }
          }
        }
        break
    }
  }

  return newGraph
}

export const processChunk: ProcessChunk<PromptOutput> = async ({
  chunk,
  chunkIndex,
  aggregatedResponse,
  onProcessChunk
}) => {
  const process = async () => {
    const existingGraph = aggregatedResponse ? mergeEventsIntoGraph(aggregatedResponse.events) : null

    const lastEvents = aggregatedResponse?.events || []

    // log the chapter if is in the chunk
    const upperCaseChunk = chunk.toUpperCase()
    const match = upperCaseChunk.match(chapterStartRegex)

    const cleanedChunk = cleanForAnalysis(chunk)

    // First chunk hasn't gotten to the book yet
    // Small chunks are probably not parts of the book
    if (cleanedChunk.length < 300) {
      return {
        events: lastEvents
      }
    }

    const userPrompt = generateUserPrompt({
      characterGraph: existingGraph,
      bookChunk: cleanedChunk
    })

    const response = await prompt({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ]
    }) as PromptOutput

    if (response?.events) {
      return {
        events: [...lastEvents, ...response.events]
      } 
    }

    return {
      events: [...lastEvents]
    }
  }

  const result = await process()

  if (onProcessChunk) {
    onProcessChunk({
      chunk,
      chunkIndex,
      processed: result
    })
  }

  return result
}

export const createCharacterGraph = (params: {
  getBookContents: () => string,
  saveAggregatedResponse: (response: PromptOutput) => Promise<void>,
  onProcessChunk?: OnProcessChunk<PromptOutput>
}) => {
  return processBook<PromptOutput>({
    getBookContents: params.getBookContents,
    saveAggregatedResponse: params.saveAggregatedResponse,
    processChunk,
    onProcessChunk: params.onProcessChunk
  })
}