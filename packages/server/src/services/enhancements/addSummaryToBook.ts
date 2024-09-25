import { EnhancementType } from "@prisma/client"
import { prisma } from "../../prisma"
import { Summary } from "./schemas/summary-v1"
import { createEnhancement } from "./core/createEnhancement"
import { buildEnhancementPatch } from "./core/buildEnhancementPatch"
import { addEnhancementPatch } from "./core/addEnhancementPatch"

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

  const patch = buildEnhancementPatch({
    enhancementType: EnhancementType.summary,
    operation: {
      op: 'replace',
      value: summary.chunks,
    },
    path: ['chunks'],
  })

  await addEnhancementPatch({
    enhancementId: enhancement.id,
    enhancementType: EnhancementType.summary,
    patch,
    userId: 'SUPER_USER',
  })
}