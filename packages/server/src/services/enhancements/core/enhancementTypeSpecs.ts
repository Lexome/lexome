import { EnhancementType } from "../../../generated/graphql"
import { summarySchema } from "../schemas/summary-v1";
import { discussionSchema } from "../schemas/discussion-v1";
import { narrationSchema } from "../schemas/narration-v1";
import { EnhancementTypeSpec } from "../types";
import { discussionAuthorizor } from "../authorizors/discussion";

export const enhancementTypeSpecs: EnhancementTypeSpec = {
  [EnhancementType.Summary]: {
    slug: EnhancementType.Summary,
    schema: summarySchema,
    displayName: "Summary",
  },

  [EnhancementType.Discussion]: {
    slug: EnhancementType.Discussion,
    schema: discussionSchema,
    displayName: "Discussion",
    authorizor: discussionAuthorizor
  },

  [EnhancementType.Narration]: {
    slug: EnhancementType.Narration,
    schema: narrationSchema,
    displayName: "Narration",
  },
}
