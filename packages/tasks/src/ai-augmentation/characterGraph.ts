import { ProcessChunk } from "./bookChunks"

type CharacterNode = {
  id: string
  name: string
}

type CharacteristicType = 'APPEARANCE' | 'PERSONALITY' | 'NAMES'

type CharacteristicNode = {
  id: string,
  characterId: string,
  info: string,
  characteristicType?: CharacteristicType,
}

type RelationshipNode = {
  id: string,
  fromCharacterId: string,
  toCharacterId: string,
  info: string
}

type CharacterGraph = {
  characters: {
    [id: string]: CharacterNode
  },
  characteristics: {
    [id: string]: CharacteristicNode
  },
  relationships: {
    [id: string]: RelationshipNode
  }
}

const generatePrompt = (params: {
  characterGraph: CharacterGraph | null,
  bookChunk: string
}) => {
  const { characterGraph } = params

  const existingGraphInstructions = characterGraph
   ? `
    You have already started a character graph from previous exerpts. Here are the characters, characteristics, and relationships
    you have so far, in JSON format. Do not add new characters if they already exist in the graph. Instead, add 
    or modify characteristics and relationships for existing characters.

    ${JSON.stringify(characterGraph)}
   `
   : `
     You have not yet started building a new character graph yet. Any characters, characteristics, and relationships
     you add will added to a new graph.
   `

   return `
   You are an automated character graph generator. Given an excerpt from a book, you will generate a character graph
   of the characters, their characteristics, and their relationships.

   You can capture this information by emitting new events. Here are the events you can emit:

   ADD_CHARACTER: Add a new character to the graph
   Example: {
    type: 'ADD_CHARACTER',
    id: 'john_doe',
   }

  ADD_CHARACTERISTIC: Add a new characteristic to a character
  Example: {
    type: 'ADD_CHARACTERISTIC',
    characteristicType: 'APPEARANCE',
    id: 'john_doe_1',
    characterId: 'john_doe',
    info: 'Tall, dark, and handsome'
  }

  ADD_RELATIONSHIP: Add a relationship between two characters. You can use $TO to refer to the toCharacterId in the info field
  Example: {
    type: 'ADD_RELATIONSHIP',
    id: 'john_doe_jane_smith',
    fromCharacterId: 'john_doe',
    toCharacterId: 'jane_smith',
    info: 'Married to $TO'
  }

  MODIFY_CHARACTERISTIC: Modify an existing characteristic
  Example: {
    type: 'MODIFY_CHARACTERISTIC',
    id: 'john_doe_1',
    info: 'Tall with dark features. His once-handsome face now has severe scarring from a recent accident'
  }

  MODIFY_RELATIONSHIP: Modify an existing relationship
  Example: {
    type: 'MODIFY_RELATIONSHIP',
    id: 'john_doe_jane_smith',
    info: 'Divorced from $TO'
  }

  If applicable, ADD_CHARACTERISTIC event should have a field "characteristicType" if the characteristic
  is one of the following types of information:
  APPEARANCE -- Physical appearance of the character
  PERSONALITY -- Character's personality traits
  NAMES -- Names the character goes by. This should be a comma-separated list of names if the character goes by multiple names

  This is the book excerpt you will be processing:
  ${params.bookChunk}

  ${existingGraphInstructions}

  Generate an JSON object with one key: "events". The value of events should be an array
  of events to emit, in the format demonstrated above. If no character changes are
  present in the excerpt, emit an empty array.
`}

type MutationType = 'ADD_CHARACTER' | 'ADD_CHARACTERISTIC' | 'ADD_RELATIONSHIP' | 'MODIFY_CHARACTERISTIC' | 'MODIFY_RELATIONSHIP'

type GraphMutation = {
  type: 'ADD_CHARACTER',
  id: string,
} | {
  type: 'ADD_CHARACTERISTIC',
  id: string,
  characterId: string,
  characteristicType?: CharacteristicType,
  info: string
} | {
  type: 'ADD_RELATIONSHIP',
  id: string,
  fromCharacterId: string,
  toCharacterId: string,
  info: string
} | {
  type: 'MODIFY_CHARACTERISTIC',
  id: string,
  info: string
} | {
  type: 'MODIFY_RELATIONSHIP',
  id: string,
  info: string
}

type PromptOutput = {
  events: GraphMutation[]
}

const mergeEventsIntoGraph = (events: GraphMutation[]): CharacterGraph => {
  const newGraph: CharacterGraph = {
    characters: {},
    characteristics: {},
    relationships: {}
  }

  for (const event of events) {
    switch (event.type) {
      case 'ADD_CHARACTER':
        newGraph.characters[event.id] = {
          id: event.id,
          name: event.id
        }
        break
      case 'ADD_CHARACTERISTIC':
        newGraph.characteristics[event.id] = {
          id: event.id,
          characterId: event.characterId,
          characteristicType: event.characteristicType,
          info: event.info
        }
        break
      case 'ADD_RELATIONSHIP':
        newGraph.relationships[event.id] = {
          id: event.id,
          fromCharacterId: event.fromCharacterId,
          toCharacterId: event.toCharacterId,
          info: event.info
        }
        break
      case 'MODIFY_CHARACTERISTIC':
        newGraph.characteristics[event.id].info = event.info
        break
      case 'MODIFY_RELATIONSHIP':
        newGraph.relationships[event.id].info = event.info
        break
    }
  }

  return newGraph
}

const processChunk: ProcessChunk<PromptOutput> = ({ chunk, aggregatedResponse }) => {
  const existingGraph = aggregatedResponse ? mergeEventsIntoGraph(aggregatedResponse.events) : null

  const prompt = generatePrompt({
    characterGraph: existingGraph,
    bookChunk: chunk
  })

  return {
    events: []
  }
}