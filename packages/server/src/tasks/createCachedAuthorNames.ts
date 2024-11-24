import { prisma } from '../prisma'

const createCachedAuthorNames = async () => {
  const books = await prisma.book.findMany({
    include: {
      authors: true
    }
  })

  for (const book of books) {
    const authorNames = book.authors.map((author) => author.display_name).join(', ')
    await prisma.book.update({
      where: { id: book.id },
      data: { author_names_cached: authorNames }
    })
  }
}

export default createCachedAuthorNames
