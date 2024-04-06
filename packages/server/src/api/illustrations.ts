import { Express } from 'express';
import { addEnhancementEvent } from '../enhancementUtils';
import { prisma } from '../client';
import {
  readingComprehension as readingComprehensionSchema } from '../schemas/reading-comprehension-v1';
import { MiddlewareRequest } from '../middleware';

const READING_COMPREHENSION_TYPE_NAME = 'Reading Comprehension';

export const addRoutes = (app: Express) => {
  app.post('/addQuestion', async (req: MiddlewareRequest, res) => {
    const { question, answer, enhancementId } = req.body;

    if(!req.user) {
      res.status(401).send('Unauthorized');
      return;
    };

    const adminSubscriptions = req.user.subscriptions.filter(sub => {
      sub.role === 'admin' &&
      sub.enhancement_id === enhancementId
    });

    if (adminSubscriptions.length === 0) {
      res.status(403).send('Unauthorized');
      return;
    }

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

    await addEnhancementEvent({
      enhancementId,
      enhancementTypeId: enhancementType.id,
      schema: readingComprehensionSchema,
      path: ['questions'],
      operation: {
        op: 'add',
        value: question 
      },
      userId: req.user.id
    })
  })

}