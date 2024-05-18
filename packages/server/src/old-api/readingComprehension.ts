import { Express } from 'express';
import { addEnhancementEvent, coalesceEnhancementData, findAndCoalesceEnhancement, isUserAdmin, isUserSubscribed } from '../enhancementUtils';
import { prisma } from '../client';
import {
  readingComprehension as readingComprehensionSchema } from '../schemas/reading-comprehension-v1';
import { MiddlewareRequest } from '../middleware';

const READING_COMPREHENSION_SLUG = 'reading-comprehension';

const URI_PREFIX = '/reading-comprehension'

const checkReadingComprehensionTypes = async (res: any) => {
  const readingComprehensionType = await prisma.enhancement_type.findUnique({
    where: {
      slug: READING_COMPREHENSION_SLUG
    }
  })

  if (!readingComprehensionType) {
    throw new Error('Reading Comprehension enhancement type not found')
  }

  return readingComprehensionType;
}

const READING_COMPREHENSION_TYPE_NAME = 'test'



export const addRoutes = (app: Express) => {
  app.post(`${URI_PREFIX}/question`, async (req: MiddlewareRequest, res) => {
    const {
      question,
      questionId,
      enhancementId,
      anchor,
      answer,
      choices
    } = req.body;

    if (!isUserAdmin({ req, enhancementId })) {
      res.status(403).send('Unauthorized');
      return;
    };

    try {
      const enhancementType = await checkReadingComprehensionTypes(res);
      const {
        enhancement,
        coalescedData
      } = await findAndCoalesceEnhancement(enhancementId)

      const operation = coalescedData[READING_COMPREHENSION_SLUG].questions[questionId]
        ? 'replace'
        : 'add';

      await addEnhancementEvent({
        enhancementId,
        enhancementTypeId: enhancementType.id,
        schema: readingComprehensionSchema,
        path: ['questions', questionId],
        operation: {
          op: operation,
          value: {
            question,
            answer,
            anchor,
            choices,
            createdAt: new Date()
          }
        },
        userId: req.user!.id
      })
    } catch (e) {
      res.status(400).send(String(e));
    }
  })

  app.post('/response', async (req: MiddlewareRequest, res) => {
    const {
      questionId,
      response,
      enhancementId,
      responseId
    } = req.body;

    if (!isUserSubscribed({ req, enhancementId })) {
      res.status(403).send('Unauthorized');
      return;
    };

    const enhancementType = await prisma.enhancement_type.findUnique({
      where: {
        display_name: READING_COMPREHENSION_TYPE_NAME
      }
    })

    if (!enhancementType) {
      console.error('Reading Comprehension enhancement type not found')
      res.status(500).send('Server does not have the Reading Comprehension enhancement type properly configured');
      return;
    }

    const enhancement = await prisma.enhancement.findUnique({
      where: {
        id: enhancementId,
      },
      include: {
        included_types: true
      }
    })

    if (!enhancement) {
      res.status(404).send('Enhancement not found')
      return
    }

    const coalescedData = await coalesceEnhancementData({
      enhancement,
      enhancementTypes: enhancement.included_types
    })

    const answerKey = Object.keys(coalescedData.responses)
      .find(key => {
        const response = coalescedData.responses[key as keyof typeof coalescedData.responses]
        if (response.questionId === questionId && response.userId === req.user!.id) {
          return true
        } else {
          return false
        }
      })
    
    if (answerKey) {
      await addEnhancementEvent({
        enhancementId,
        enhancementTypeId: enhancementType.id,
        schema: readingComprehensionSchema,
        path: ['responses', answerKey],
        operation: {
          op: 'replace',
          value: {
            userId: req.user!.id,
            questionId,
            value: response
          }
        },
        userId: req.user!.id
      })
    } else {
      await addEnhancementEvent({
        enhancementId,
        enhancementTypeId: enhancementType.id,
        schema: readingComprehensionSchema,
        path: ['responses'],
        operation: {
          op: 'add',
          value: {
            questionId,
            response
          }
        },
        userId: req.user!.id
      })
    }
  })
}