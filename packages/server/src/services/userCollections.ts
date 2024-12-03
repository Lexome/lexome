import { prisma } from "../prisma"

export const createNewCollection = async (params: {
  userId: string
}) => {
  const { userId } = params

  const collection = await prisma.user_collection.create({
    data: {
      user_id: userId,
    },
    include: {
      books: true,
      user: true
    }
  })

  return collection
}

export const getUserCollection = async (params: { userId: string }) => {
  const { userId } = params

  const collection = await prisma.user_collection.findFirst({
    where: { user_id: params.userId },
    include: {
      books: true,
      user: true
    }
  })

  if (!collection) {
    return createNewCollection({ userId })
  }

  return collection
}

export const addBookToCollection = async (params: { userId: string, bookId: string }) => {
  const { userId, bookId } = params

  const collection = await getUserCollection({ userId })

  return prisma.user_collection.update({
    where: { id: collection.id },
    data: {
      books: {
        connect: { id: bookId }
      }
    }
  })
}

export const removeBookFromCollection = async (params: { userId: string, bookId: string }) => {
  const { userId, bookId } = params

  const collection = await getUserCollection({ userId })

  return prisma.user_collection.update({
    where: { id: collection.id },
    data: {
      books: {
        disconnect: { id: bookId }
      }
    }
  })
}
