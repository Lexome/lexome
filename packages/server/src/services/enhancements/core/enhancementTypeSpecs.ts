import { EnhancementType } from "@prisma/client"
import { summarySchema } from "../schemas/summary-v1";

type EnhancementTypeSpec = {
  [key in EnhancementType]: {
    slug: EnhancementType;
    schema: Zod.ZodObject<any>;
    displayName: string;
  }
}

export const enhancementTypeSpecs: EnhancementTypeSpec = {
  [EnhancementType.summary]: {
    slug: EnhancementType.summary,
    schema: summarySchema,
    displayName: "Summary",
  },
}