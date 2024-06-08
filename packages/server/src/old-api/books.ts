
import { Express } from 'express';
import { MiddlewareRequest } from "../middleware";
import { prisma } from '../client';
import {
  defaultErrors,
  defaultSecurityRule,
  success,
  getByIdParams
} from './spec/shared/misc'
import { bookSchema } from './spec/shared/schemas';

export const addRoutes = (app: Express) => {
  app.get('/books/:id', async (req: MiddlewareRequest, res) => {
    const bookId = req.params.id
    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
      include: {
        authors: true,
      },
    })

    if (!book) {
      res.status(404).send('Book not found')
      return
    }

    res.json(book)
  })

  app.get('/books', async (req: MiddlewareRequest, res) => {
    const authorId = req.query.authorId
    const queryTerm = req.query.query

    const books = await prisma.book.findMany({
      where: {
        authors: {
          some: {
            id: authorId ? authorId as string: undefined,
          },
        },
        AND: [
          {
            title: {
              contains: queryTerm ? queryTerm as string: undefined,
            },
          },
        ],
      },
    })

    return res.json(books)
  })

  app.post('/books', async (req: MiddlewareRequest, res) => {
    const book = await prisma.book.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        cover_url: req.body.coverUrl,
        authors: {
          connect: req.body.authorIds.map((id: string) => ({ id })),
        },
      },
    })

    res.json(book)
  })
}

export const routesSpec = {
  "/book/{id}": {
    get: {
      operationId: "getBook",
      ...getByIdParams,
      responses: {
        ...defaultErrors,
        ...success(bookSchema) 
      },
      ...defaultSecurityRule
    }
  },
  "/books": {
    get: {
      summary: "Get enhancements by book",
      operationId: "getEnhancements",
      parameters: [
        {
          name: "authorId",
          in: "query",
          description: "author to filter by",
          required: false,
          schema: {
            type: "string",
            format: "uuid"
          }
        },
        {
          name: "query",
          in: "query",
          description: "search query",
          required: false,
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        ...success({
          type: "array",
          items: bookSchema
        }),
        ...defaultErrors
      },
      ...defaultSecurityRule
    },
    post: {
      operationId: "createBook",
      responses: {
        ...defaultErrors,
        ...success(bookSchema) 
      },
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string"
                },
                description: {
                  type: "string"
                },
                coverUrl: {
                  type: "string"
                },
                authorIds: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "uuid"
                  }
                }
              }
            }
          }
        }
      },
      ...defaultSecurityRule
    }
  },
}