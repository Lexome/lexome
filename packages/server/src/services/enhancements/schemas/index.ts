import { EnhancementType } from "../../../generated/graphql"
import { Summary, summarySchema } from "./summary-v1"

export type Enhancements = {
  [EnhancementType.Summary]: Summary
}

export const schemas = {
  [EnhancementType.Summary]: summarySchema
}