import { v4 as uuid } from 'uuid'
import { addEnhancementPatch } from '../core/addEnhancementPatch'
import { buildEnhancementPatch } from '../core/buildEnhancementPatch'
import { EnhancementType } from '../../../generated/graphql'
import { Discussion } from '../schemas/discussion-v1'

const buildDiscussionPatch = (params: {
  data: Discussion,
  userId: string,
  message: string,
  replyParents: string[] | null
}) => {
  const { userId, message, replyParents, data: discussion } = params

  if (!replyParents) {
    const updatePath = ['threads', -1] as const
  } else {
    const updatePath = ['threads']
    let threads: (Reply)[] = discussion.threads

    while (replyParents.length > 0) {
      const replyParent = replyParents.shift()
      const parentIndex = threads.findIndex(thread => thread.id === replyParent)
      const parent = discussion.threads[parentIndex]
      threads = parent.replies
    }
  }

  buildEnhancementPatch({
    enhancementType: EnhancementType.,
    path: [
      'threads'
    ]
  })



  const n

}