import { EnhancementType } from "../../../generated/graphql"
import { summarySchema } from "../schemas/summary-v1";
import { notesSchema } from "../schemas/notes-v1";
import { narrationSchema } from "../schemas/narration-v1";
import { EnhancementTypeSpec } from "../types";
import { notesAuthorizor } from "../authorizors/notes";

export const enhancementTypeSpecs: EnhancementTypeSpec = {
  [EnhancementType.Summary]: {
    slug: EnhancementType.Summary,
    schema: summarySchema,
    displayName: "Summary",
  },

  [EnhancementType.Notes]: {
    slug: EnhancementType.Notes,
    schema: notesSchema,
    displayName: "Notes",
    authorizor: notesAuthorizor
  },

  [EnhancementType.Narration]: {
    slug: EnhancementType.Narration,
    schema: narrationSchema,
    displayName: "Narration",
  },
}
