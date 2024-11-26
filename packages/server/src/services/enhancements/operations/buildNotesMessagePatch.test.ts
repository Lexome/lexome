import { Notes } from '../schemas/notes-v1'
import { buildNotesMessagePatch } from './buildNotesMessagePatch'
import { v4 as uuidv4 } from 'uuid'

describe('buildNotesMessagePatch', () => {
  // creates thread reply 
  it('creates top level thread', () => {
    const patch = buildNotesMessagePatch({
      data: {} as any,
      userId: '123',
      anchor: {
        word: 'Test',
        suffixHash: '123',
      },
      userDisplayName: 'Test User',
      message: 'Test message',
    })

    expect(patch).toEqual({
      op: 'add',
      path: '/discussion/threads/-1',
      value: {
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        message: 'Test message',
        author: {
          id: '123',
          displayName: 'Test User'
        },
        replies: [],
        anchor: {
          word: 'Test',
          suffixHash: '123',
        }
      }
    })
  })

  it('creates reply', () => {
    const replyParentId = uuidv4()

    const patch = buildNotesMessagePatch({
      data: {
        repliesAllowed: true,
        threads: [
          {
            id: replyParentId,
            replies: [],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            author: {
              id: '123',
              displayName: 'Test User'
            },
            message: '',
          }
        ]
      } as Notes,
      userId: '123',
      replyParents: [replyParentId],
      userDisplayName: 'Test User',
      message: 'Test message',
    })

    expect(patch).toEqual({
      op: 'add',
      path: `/notes/threads/${replyParentId}/replies/-1`,
      value: {
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        message: 'Test message',
        author: {
          id: '123',
          displayName: 'Test User'
        },
        replies: [],
      }
    })
  })

  it('create nested reply', () => {
    const replyParentId = uuidv4()
    const replyParentId2 = uuidv4()

    const patch = buildNotesMessagePatch({
      userId: '123',
      userDisplayName: 'Test User',
      message: 'Nested reply message',
      replyParents: [replyParentId, replyParentId2],
      data: {
        repliesAllowed: true,
        threads: [
          {
            id: replyParentId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            author: {
              id: '123',
              displayName: 'Test User'
            },
            message: '',
            replies: [{
              id: replyParentId2,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              author: {
                id: '123',
                displayName: 'Test User'
              },
              message: '',
              replies: [],
            }],
          }
        ]
      } as Notes,
    })

    expect(patch).toEqual({
      op: 'add',
      path: `/notes/threads/${replyParentId}/replies/${replyParentId2}/replies/-1`,
      value: {
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        message: 'Nested reply message',
        author: {
          id: '123',
          displayName: 'Test User'
        },
      }
    })
  })
})
