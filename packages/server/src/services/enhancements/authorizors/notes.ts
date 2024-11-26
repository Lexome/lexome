import { EnhancementType } from "../../../generated/graphql";
import { SUPER_USER_STRING } from "../constants";
import { Authorizor } from "../types";

export const notesAuthorizor: Authorizor<EnhancementType.Notes> = async ({ enhancementData, patch, subscription }) => {
  if (patch.op !== 'add') {
    return false
  }

  // Match pattern /threads/- or /threads/1/replies/- or /threads/1/replies/2/replies/- etc
  const path = patch.path.split('/')

  if (path.length < 2) {
    return false
  }

  const positionRegex = /^\d+$|-$/

  const firstPath = path.shift()
  const secondPath = path.shift() || ''

  if (firstPath !== 'threads' || !positionRegex.test(secondPath)) {
    return false
  }

  while (path.length > 1) {
    const nextPath = path.pop() || ''
    const nextPositionPath = path.pop() || ''

    if (nextPath !== 'replies' || !positionRegex.test(nextPositionPath)) {
      return false
    }
  }

  if (subscription === SUPER_USER_STRING) {
    return true
  }

  if (patch.value.author.id !== subscription.user_id) {
    return false
  }

  return true
}