import { EnhancementType } from "../../../generated/graphql"
import { Summary } from "./summary-v1"

export type Schemas = {
  [EnhancementType.Summary]: Summary
}