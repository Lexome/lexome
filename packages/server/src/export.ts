export {
  EnhancementType,
  ReaderFontPreference,
  ThemeMode,
  Personalization,
} from "./generated/graphql"

export { buildEnhancementPatch } from "./services/enhancements/core/buildEnhancementPatch"
export { buildNotesMessagePatch } from "./services/enhancements/operations/buildNotesMessagePatch"
export { validateEnhancementPatch } from "./services/enhancements/core/validateEnhancementPatch"
export { enhancementTypeSpecs } from "./services/enhancements/core/enhancementTypeSpecs"
export { applyEnhancementPatches } from "./services/enhancements/core/applyEnhancementPatches"
export type { Enhancements } from './services/enhancements/schemas'
export { schemas } from './services/enhancements/schemas'
export type { Hash, HashIndex, HashOrdering } from './services/hash'
export {
  createHashes,
  hashWords,
  hash,
  prepareTextForHash
} from './services/hash'
