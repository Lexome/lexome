import { v4 as uuid } from 'uuid'
import { buildEnhancementPatch } from '../core/buildEnhancementPatch'
import { EnhancementType } from '../../../generated/graphql'
import { Notes, Reply, Thread } from '../schemas/notes-v1'
import { Anchor } from '../schemas/shared/anchor-v1'

export const buildNotesMessagePatch = (params: {
  data: Notes,
  userId: string,
  userDisplayName: string,
  message: string,
  replyParents?: string[],
  anchor?: Anchor
}) => {
  const {
    userId,
    userDisplayName,
    message,
    replyParents,
    anchor,
    data: notes
  } = params

  const updatePath: (string | number)[] = ['threads']

  const now = new Date()
  const timestamp = now.toISOString()

  const sharedFields = {
    id: uuid(),
    author: {
      id: userId,
      displayName: userDisplayName
    },
    message,
    createdAt: timestamp,
    updatedAt: timestamp,
    replies: [],
  }

  if (replyParents && replyParents.length > 0) {
    let threads: (Reply | Thread)[] = notes.threads

    while (replyParents.length > 0) {
      const replyParent = replyParents.shift()
      const foundIndex = threads.findIndex(thread => thread.id === replyParent)
      const parent = notes.threads[foundIndex]
      updatePath.push(foundIndex)
      updatePath.push('replies')

      threads = parent.replies
    }

    updatePath.push(-1)

    const reply: Reply = {
      ...sharedFields
    }

    return buildEnhancementPatch({
      enhancementType: EnhancementType.Notes,
      path: updatePath as any,
      operation: {
        op: 'add',
        value: reply
      }
    })

  } else {
    updatePath.push(-1)

    const thread: Thread = {
      ...sharedFields,
      anchor
    }

    return buildEnhancementPatch({
      enhancementType: EnhancementType.Notes,
      path: updatePath as any,
      operation: {
        op: 'add',
        value: thread
      }
    })
  }
}