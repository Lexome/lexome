import { EnhancementType } from "../../../generated/graphql"
import { Summary, summarySchema } from "./summary-v1"
import { Narration, narrationSchema } from "./narration-v1"
import { Notes, notesSchema } from "./notes-v1"

export type Enhancements = {
  [EnhancementType.Summary]: Summary,
  [EnhancementType.Notes]: Notes,
  [EnhancementType.Narration]: Narration,
}

export const schemas = {
  [EnhancementType.Summary]: summarySchema,
  [EnhancementType.Notes]: notesSchema,
  [EnhancementType.Narration]: narrationSchema,
}
