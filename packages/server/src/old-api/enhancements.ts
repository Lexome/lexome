
import { Express } from 'express';
import { MiddlewareRequest } from "../middleware";
import { prisma } from '../client';
import { coalesceEnhancementData } from '../enhancementUtils';
import {
  defaultErrors,
  defaultSecurityRule,
  success,
  getByIdParams
} from './spec/shared/misc'
import { enhancementSchema } from './spec/shared/schemas';

export const addRoutes = (app: Express) => {
  app.get('/enhancement/:id', async (req: MiddlewareRequest, res) => {
    if (!req.user) {
      res.status(403).send('Unauthorized');
      return;
    }

    const enhancementId = req.params.id;
    const enhancement = await prisma.enhancement.findUnique({
      where: {
        id: enhancementId,
      },
      include: {
        included_types: true,
        subscriptions: true
      }
    });

    if (!enhancement || !enhancement.included_types) {
      res.status(404).send('Enhancement not found');
      return;
    }

    if (!enhancement.subscriptions.some(sub => sub.user_id === req.user!.id)) {
      res.status(403).send('Unauthorized');
      return;
    }

    const coalescedData = coalesceEnhancementData({
      enhancement: enhancement!,
      enhancementTypes: enhancement?.included_types!
    })

    res.json({
      ...enhancement,
      data: JSON.stringify(coalescedData)
    });
  })

  app.get('/enhancements', async (req: MiddlewareRequest, res) => {
    const { bookId } = req.query;
    const enhancements = await prisma.enhancement.findMany({
      where: {
        book_id: bookId as string
      },
      include: {
        included_types: true,
      }
    });

    res.send(enhancements);
  })

  app.get('/enhancement-types', async (req: MiddlewareRequest, res) => {
    const enhancementTypes = await prisma.enhancement_type.findMany();
    res.send(enhancementTypes);
  })

  app.get('/subscribed-enhancements', async (req: MiddlewareRequest, res) => {
    if (!req.user) {
      res.status(403).send('Unauthorized');
      return;
    }

    const enhancements = await prisma.enhancement.findMany({
      where: {
        subscriptions: {
          some: {
            user_id: req.user!.id
          }
        }
      }
    })
    res.send(enhancements);
  })

  app.post('/enhancement', async (req: MiddlewareRequest, res) => {
    const { typeIds } = req.body;
    const { bookId } = req.body;
    const { title } = req.body;

    if(!req.user) {
      res.status(401).send('Unauthorized');
      return;
    };

    const enhancementTypes = await prisma.enhancement_type.findMany({
      where: {
        id: {
          in: typeIds
        }
      }
    })

    if (enhancementTypes.length !== typeIds) {
      res.status(400).send('Invalid enhancement type ids');
      return;
    }

    // json-patch operation for adding a question to the enhancement
    await prisma.enhancement.create({
      data: {
        title,
        book: {
          connect: {
            id: bookId
          }
        },
        included_types: {
          connect: enhancementTypes.map(type => ({ id: type.id }))
        },
        subscriptions: {
          create: [{
            user: {
              connect: {
                id: req.user!.id
              }
            },
            role: 'admin'
          }]
        }
      }
    })
  })
}

export const routesSpec = {
  "/enhancements/{id}": {
    get: {
      operationId: "getEnhancement",
      responses: {
        ...defaultErrors,
        ...success(enhancementSchema) 
      },
      ...getByIdParams,
      ...defaultSecurityRule
    }
  },
  "/enhancements": {
    get: {
      summary: "Get enhancements by book",
      operationId: "getEnhancements",
      parameters: [
        {
          name: "bookId",
          in: "query",
          description: "Book to filter by",
          required: true,
          schema: {
            type: "string",
            format: "uuid"
          }
        }
      ],
      responses: {
        ...success({
          type: "array",
          items: enhancementSchema
        }),
        ...defaultErrors
      },
      ...defaultSecurityRule
    },
    post: {
      summary: "Create enhancement",
      description: "Create a new enhancement",
      operationId: "createEnhancement",
      requestBody: {
        description: "Create a new enhancement",
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "bookId",
                "title",
                "includedTypes"
              ],
              properties: {
                book_id: {
                  type: "string",
                  format: "uuid"
                },
                title: {
                  type: "string"
                },
                included_types: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "uuid"
                  }
                }
              }
            }
          }
        },
        required: true
      },
      responses: {
        ...success(enhancementSchema), 
        ...defaultErrors
      },
      ...defaultSecurityRule
    }
  },
  "/subscribed-enhancements": {
    get: {
      summary: "Finds enhancements user is subscribed to",
      operationId: "getSubscribedEnhancements",
      responses: {
        ...success({
          type: "array",
          items: enhancementSchema 
        }),
        ...defaultErrors
      },
      ...defaultSecurityRule
    }
  }
}