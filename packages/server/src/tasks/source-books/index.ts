import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";
import { downloadBook, getEbookLinks } from "./scrapeStandardEbooks";
import { findPackageRoot } from "../utils";
import { prisma } from "../../client";

const packageRoot = findPackageRoot()

const LOWERCASE_WORDS = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with']

const isRomanNumeral = (str: string) => {
  return /^[ivxlcdmIVXLCDM]+$/.test(str)
}

const formatBookTitle = (title: string) => {
  // split title by dashes
  const titleParts = title.split('-')
  return titleParts
    .map((part, i) => {
      if (isRomanNumeral(part)) {
        return part.toUpperCase()
      }

      if (i === 0) {
        return part.charAt(0).toUpperCase() + part.slice(1)
      }

      if (LOWERCASE_WORDS.includes(part)) {
        return part
      }

      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join(' ')
}

if (!packageRoot) {
  throw new Error('Could not find package root')
}

const outputDir = path.join(packageRoot, 'scraped')

const formatAuthorDisplayName = (author: string) => {
  const authorParts = author.split('-')
  const formattedAuthorParts = authorParts.map((part) => {
    const capitalized = part.charAt(0).toUpperCase() + part.slice(1)
    return capitalized.length === 1 ? capitalized + '.' : capitalized
  })

  return formattedAuthorParts.join(' ')
}




const main = async () => {
  const jsonBooksList = fs.readFileSync(path.join(outputDir, 'ebook-links.json'), 'utf8')
  const booksFromJson = JSON.parse(jsonBooksList)

  const authorSlugs = new Set()
  const titleSlugs = new Set()

  for (const book of booksFromJson) {
    const bookParts = book.split('/')
    const author = bookParts[2]
    const title = bookParts[3]

    authorSlugs.add(author)
    titleSlugs.add(title)
  }

  // const ebookLinks = await getEbookLinks();

  // console.log('links', ebookLinks)

  // Write to file
  // const writePath = path.join(outputDir, 'ebook-links.json')
  // fs.writeFileSync(writePath, JSON.stringify(ebookLinks, null, 2))

  const booksDirectory = path.join(outputDir, 'books')
  const books = fs.readdirSync(booksDirectory)

  for (const book of books) {
    const epubUrl = `https://storage.googleapis.com/standard-ebooks/books/${book}`
    const coverUrl = `https://storage.googleapis.com/standard-ebooks/covers/${book}`.replace('.epub', '.jpg')

    let bookParts = book.split('_')
    let author = ''
    let title = ''

    // Find longest concatation of book parts that is in author set
    for (let i = bookParts.length; i > 0; i--) {
      const testAuthorSlug = bookParts.slice(0, i).join('_')

      if (authorSlugs.has(testAuthorSlug)) {
        author = testAuthorSlug
        title = bookParts[i]
      }
    }

    const authors = author.split('_').map(formatAuthorDisplayName)
    const authorIds: string[] = []

    for (const author of authors) {
      const authorRecord = await prisma.author.findFirst({
        where: {
          display_name: author
        }
      })

      if (!authorRecord) {
        console.log('author not found', author)
      } else {
        authorIds.push(authorRecord.id)
      }
    }

    const bookTitle = formatBookTitle(title.replace('.epub', ''))

    const bookRecord = await prisma.book.findFirst({
      where: {
        title: bookTitle
      }
    })

    if (!bookRecord) {
      console.log('creating book', bookTitle)
      await prisma.book.create({
        data: {
          title: bookTitle,
          cover_url: coverUrl,
          asset_url: epubUrl,
          authors: {
            connect: authorIds.map((id) => ({ id }))
          }
        }
      })
    } else {

      console.log('updating book', bookTitle)
      await prisma.book.update({
        where: {
          id: bookRecord.id
        },
        data: {
          authors: {
            connect: authorIds.map((id) => ({ id }))
          }
        }
      })
    }

    // const author = bookParts[0]
    // const formattedAuthor = formatAuthorDisplayName(author)

    // const authorRecord = await prisma.author.findFirst({
    //   where: {
    //     display_name: formattedAuthor
    //   }
    // })

    // if (!authorRecord) {
    //   console.log('author not found', formattedAuthor)
    // }

    // let bookTitle = bookParts[1]

    // bookTitle = bookTitle.replace('.epub', '')

    // bookTitle = formatBookTitle(bookTitle)

    // const bookRecord = prisma.book.findFirst({
    //   where: {
    //     title: bookTitle
    //   }
    // })

    // if (!bookRecord && authorRecord) {
    //   prisma.book.create({
    //     data: {
    //       title: bookTitle,
    //       authors: {
    //         connect: {
    //           id: authorRecord.
    //         }
    //       }
    //     }
    //   })
    // }
    // Make temp folder in books directory
    // const tempFolder = path.join(booksDirectory, 'temp')
    // const coversFolder = path.join(booksDirectory, 'covers')

    // if (!fs.existsSync(tempFolder)) {
    //   // fs.rmdirSync(tempFolder, { recursive: true })
    //   fs.mkdirSync(tempFolder)
    // }

    // if (!fs.existsSync(coversFolder)) {
    //   fs.mkdirSync(coversFolder)
    // }

    // Unzip epub book into temp folder
    // const bookNoExtension = book.split('.').slice(0, -1).join('.')
    // const tempFolderBookPath = path.join(tempFolder, bookNoExtension)
    // fs.mkdirSync(tempFolderBookPath)

    // const unzipCommand = `unzip ${bookPath} -d ${tempFolderBookPath}`
    // const unzipResult = execSync(unzipCommand)

    // copy image in temp folder epub to covers folder
    // const coverPath = path.join(tempFolderBookPath, 'epub/images/cover.jpg')
    // if (!fs.existsSync(coverPath)) {
    //   console.log('no cover found for ', book)
    // } else {
      // const coverDestination = path.join(coversFolder, `${bookNoExtension}.jpg`)
      // fs.copyFileSync(coverPath, coverDestination)
    // }
  }



  // let skip = true

  // for (let i = 0; i < books.length; i++) {
  //   console.log(`downloading book ${i + 1} of ${books.length}`)
  //   console.log('book', books[i])
  //   const book = books[i]
 
  //   if (book === '/ebooks/h-beam-piper/the-cosmic-computer') {
  //     skip = false
  //   }

  //   if (skip) {
  //     console.log('skipping book')
  //   } else {
  //     await downloadBook('https://standardebooks.org' + book)
  //   }
  // }
}

main()