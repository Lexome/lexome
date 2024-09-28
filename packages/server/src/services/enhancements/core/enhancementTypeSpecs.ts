import { EnhancementType } from "../../../generated/graphql"
import { summarySchema } from "../schemas/summary-v1";

type EnhancementTypeSpec = {
  [key in EnhancementType]: {
    slug: EnhancementType;
    schema: Zod.ZodObject<any>;
    displayName: string;
  }
}

export const enhancementTypeSpecs: EnhancementTypeSpec = {
  [EnhancementType.Summary]: {
    slug: EnhancementType.Summary,
    schema: summarySchema,
    displayName: "Summary",
  },
}