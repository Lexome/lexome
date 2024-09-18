import { EnhancementType } from "@prisma/client"
import { prisma } from "../../prisma"
import { Summary } from "./schemas/summary-v1"
import { createEnhancement } from "./core/createEnhancement"
import { addEnhancementEvent } from "./core/addEnhancementEvent"

export const addSummaryToBook = async (params: {
  bookId: string,
  summary: Summary
}) => {
  const { bookId, summary } = params

  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  })

  if (!book) {
    throw new Error('Book not found')
  }

  const enhancement = await createEnhancement({
    bookId,
    includedTypes: [EnhancementType.summary],
    title: `${book.title} Summary`,
  })

  await addEnhancementEvent({
    enhancementId: enhancement.id,
    enhancementType: EnhancementType.summary,
    operation: {
      op: 'replace',
      value: summary.chunks,
    },
    path: ['chunks'],
    userId: 'SUPER_USER',
  })
}