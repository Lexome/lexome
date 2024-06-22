import { convertObjectPropertiesToCamelCase } from "../../utils";
import { createEnhancementEvent } from '../../enhancements'
import { prisma } from "../prisma";

enum OperationType {
  add='add',
  remove='remove',
  replace='replace'
}

export const resolvers = {
  Query: {
    getEnhancementsForBook: async (parent, args) => {
      const bookId = args.bookId;
      const enhancements = await prisma.enhancement.findMany({
        where: {
          book_id: bookId
        }
      });

      return enhancements.map(convertObjectPropertiesToCamelCase);
    },
    getSubscriptions: async (parent, args, context) => {
      const bookId = args.bookId

      let subscriptions = await prisma.subscription.findMany({
        where: {
          user_id: context.user.id,
        },
        include: {
          enhancement: true
        }
      });

      if (args.bookId) {
        subscriptions = subscriptions.filter(sub => sub.enhancement.book_id === bookId);
      }

      return subscriptions.map(convertObjectPropertiesToCamelCase);

    }
  },
  Mutation: {
    createSubscription: async (_, args, context) => {
      const { enhancementId } = args;
      const role = args.role || 'user'
      const user = context.user;

      const subscription = await prisma.subscription.create({
        data: {
          user_id: user.id,
          enhancement_id: enhancementId,
          role
        }
      });

      return convertObjectPropertiesToCamelCase(subscription);
    },

    createEnhancement: async (_, args, context) => {
      const { bookId, title, includedTypes } = args;
      const user = context.user;

      const enhancement = await prisma.enhancement.create({
        data: {
          title,
          book_id: bookId,
          creator_id: user.id,
          included_types: includedTypes
        }
      });

      return convertObjectPropertiesToCamelCase(enhancement);
    }

    createEnhancementEvent: async (
      _,
      args,
      context
    ) => {
      const user = context.user;
      const {
        enhancementId,
        enhancementType,
        operationType
      } = args

      createEnhancementEvent({
        path: args.path,
        enhancementId,
        enhancementType,
      });
    }
  },

}