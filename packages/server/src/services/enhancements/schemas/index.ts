import { EnhancementType } from "../../../generated/graphql"
import { Summary, summarySchema } from "./summary-v1"
import { Narration, narrationSchema } from "./narration-v1"
import { Discussion, discussionSchema } from "./discussion-v1"

export type Enhancements = {
  [EnhancementType.Summary]: Summary,
  [EnhancementType.Discussion]: Discussion,
  [EnhancementType.Narration]: Narration,
}

export const schemas = {
  [EnhancementType.Summary]: summarySchema,
  [EnhancementType.Discussion]: discussionSchema,
  [EnhancementType.Narration]: narrationSchema,
}
