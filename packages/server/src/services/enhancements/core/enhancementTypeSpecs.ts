import { EnhancementType } from "../../../generated/graphql"
import { summarySchema } from "../schemas/summary-v1";
import { discussionSchema } from "../schemas/discussion-v1";
import { narrationSchema } from "../schemas/narration-v1";
import { Operation } from "fast-json-patch";
import { subscription } from "@prisma/client";
import { SuperUserString } from "./constants";
import { EnhancementTypeSpec } from "../types";
import { discussionAuthorizor } from "../authorizors/discussion";

export const enhancementTypeSpecs: EnhancementTypeSpec = {
  [EnhancementType.Summary]: {
    slug: EnhancementType.Summary,
    schema: summarySchema,
    displayName: "Summary",
  },

  [EnhancementType.Chat]: {
    slug: EnhancementType.Chat,
    schema: discussionSchema,
    displayName: "Chat",
    authorizor: discussionAuthorizor
  },

  [EnhancementType.Narration]: {
    slug: EnhancementType.Narration,
    schema: narrationSchema,
    displayName: "Narration",
  },
}
