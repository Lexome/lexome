import Epub from "epubjs"
import { prisma } from "../../prisma"
import Section from "epubjs/types/section"

export const convertEbookToTextChapters = async (bookId: string) => {
  const book = await prisma.book.findUnique({
    where: {
      id: bookId
    }
  })

  if (!book) {
    throw new Error('Book not found')
  }

  const bookAssetUrl = book?.asset_url || ''

  const epub = Epub(bookAssetUrl)
  await epub.ready;

  const sectionPromises: Promise<string>[] = [];

  epub.spine.each((section: Section) => {
    const getSectionText = async () => {
      const chapter = await epub.load(section.href);

      if (!(chapter instanceof Document) || !chapter.body?.textContent) {
        return "";
      }

      return chapter.body.textContent.trim();
    }

    sectionPromises.push(getSectionText());
  })

  const content = await Promise.all(sectionPromises);
  return content.filter(text => text);
}