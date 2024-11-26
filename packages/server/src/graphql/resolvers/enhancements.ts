import { enhancement } from "@prisma/client";

import { convertObjectPropertiesToCamelCase } from "../../utils";
import { createEnhancement } from "../../services/enhancements/core/createEnhancement";
import { prisma } from "../../prisma";
import { coalesceEnhancementDataById } from "../../services/enhancements/core/coalesceEnhancementData";
import { Resolvers } from "../../generated/graphql";

export const resolvers: Resolvers = {
  Enhancement: {
    coalescedData: async (parent) => {
      const coalescedData = await coalesceEnhancementDataById({ id: parent.id })

      return JSON.stringify(coalescedData) 
    },
    coalescedTimestamp: async () => {
      return new Date().toISOString()
    }
  },
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

    getSubscribedEnhancementsForBook: async (parent, args, context) => {
      const bookId = args.bookId;
      const user = context.user;

      let enhancements: enhancement[] = []

      if (user) {
        enhancements = await prisma.enhancement.findMany({
          where: {
            subscriptions: {
              some: {
                user_id: user.id
              }
            },
            book_id: bookId
          }
        })
      }

      if (enhancements.length === 0) {
        enhancements = await prisma.enhancement.findMany({
          where: {
            is_default: true,
            book_id: bookId
          }
        })
      }

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

      if (!user) {
        throw new Error('User not found');
      }

      // If the user is already subscribed to the enhancement, return the existing subscription
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          user_id: user.id,
          enhancement_id: enhancementId
        }
      });

      if (existingSubscription) {
        return convertObjectPropertiesToCamelCase(existingSubscription);
      }

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
      const { bookId, title, includedTypes, isDefault } = args;
      const user = context.user;

      const enhancement = await createEnhancement({
        bookId,
        title,
        includedTypes,
        isDefault: isDefault || false
      })

      return convertObjectPropertiesToCamelCase(enhancement);
    },

    // addEnhancementPatch: async (
    //   _,
    //   args,
    //   context
    // ) => {
    //   const user = context.user;
    //   const {
    //     enhancementId,
    //     enhancementType,
    //     patch,
    //     operationType,
    //   } = args

    //   await addEnhancementPatch({
    //     patch,
    //     enhancementId,
    //     enhancementType,
    //     userId: user.id,
    //   });

    //   return {
    //     success: true,
    //   }
    // }
  },

}