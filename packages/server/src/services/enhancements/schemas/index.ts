import { EnhancementType } from "@prisma/client"
import { Summary } from "./summary-v1"

export type Schemas = {
  [EnhancementType.summary]: Summary
}