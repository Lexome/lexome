import { EnhancementType } from "../../../generated/graphql"
import { summarySchema } from "../schemas/summary-v1";
import { chatSchema } from "../schemas/chat-v1";
import { narrationSchema } from "../schemas/narration-v1";
import { Operation } from "fast-json-patch";
import { subscription } from "@prisma/client";
import { SuperUserString } from "./constants";
import { EnhancementTypeSpec } from "../types";
import { chatAuthorizor } from "../authorizors/chat";

export const enhancementTypeSpecs: EnhancementTypeSpec = {
  [EnhancementType.Summary]: {
    slug: EnhancementType.Summary,
    schema: summarySchema,
    displayName: "Summary",
  },

  [EnhancementType.Chat]: {
    slug: EnhancementType.Chat,
    schema: chatSchema,
    displayName: "Chat",
    authorizor: chatAuthorizor
  },

  [EnhancementType.Narration]: {
    slug: EnhancementType.Narration,
    schema: narrationSchema,
    displayName: "Narration",
  },
}
