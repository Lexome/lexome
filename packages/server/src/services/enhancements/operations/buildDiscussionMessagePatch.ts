import { v4 as uuid } from 'uuid'
import { buildEnhancementPatch } from '../core/buildEnhancementPatch'
import { EnhancementType } from '../../../generated/graphql'
import { Discussion, Reply, Thread } from '../schemas/discussion-v1'
import { anchor, Anchor } from '../schemas/shared/anchor-v1'

export const buildDiscussionMessagePatch = (params: {
  data: Discussion,
  userId: string,
  userDisplayName: string,
  message: string,
  replyParents: string[] | undefined,
  anchor?: Anchor
}) => {
  const {
    userId,
    userDisplayName,
    message,
    replyParents,
    anchor,
    data: discussion
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

  if (replyParents) {
    let threads: (Reply | Thread)[] = discussion.threads

    while (replyParents.length > 0) {
      const replyParent = replyParents.shift()
      const foundIndex = threads.findIndex(thread => thread.id === replyParent)
      const parent = discussion.threads[foundIndex]
      updatePath.push(foundIndex)
      updatePath.push('replies')

      threads = parent.replies
    }

    updatePath.push(-1)

    const reply: Reply = {
      ...sharedFields
    }

    return buildEnhancementPatch({
      enhancementType: EnhancementType,
      path: updatePath as any,
      operation: {
        op: 'add',
        value: reply
      }
    })

  } else {
    const thread: Thread = {
      ...sharedFields,
      anchor
    }
  }
}