import { GqlContext } from "./types";

export const authenticateUser = (context: GqlContext) => {
  if (!context.userId) {
    throw new Error('User not authenticated')
  }
}
