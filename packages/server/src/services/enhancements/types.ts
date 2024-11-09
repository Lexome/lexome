import { EnhancementType } from "../../generated/graphql";

import { subscription } from "@prisma/client";
import { Operation } from "fast-json-patch";
import { SuperUserString } from "./core/constants";
import { Enhancements } from "./schemas";

export type Authorizor<Type extends EnhancementType = any> = (params: {
  enhancementData: Enhancements[Type],
  patch: Operation,
  subscription: subscription | SuperUserString
}) => Promise<boolean>

export type EnhancementTypeSpec = {
  [key in EnhancementType]: {
    slug: EnhancementType;
    schema: Zod.ZodObject<any>;
    displayName: string;
    authorizor?: Authorizor<any>
  }
}
