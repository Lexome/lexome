import Epub from "epubjs"
import { prisma } from "../prisma"
import Section from "epubjs/types/section"
import * as path from "path";
import * as fs from "fs";
import { findPackageRoot } from "../utils";
import playwright from 'playwright';
import { Storage } from '@google-cloud/storage';

export const downloadBook = async (url: string) => {
  const browser =  await playwright.chromium.launch({ headless: true })
  const context = await browser.newContext()

  const page = await context.newPage()

  await page.goto(url)

  //click link with text "Compatible epub"
  await page.click('a:has-text("Compatible epub")')

  const downloadPromise = page.waitForEvent('download');
  const download = await downloadPromise;

  const fullFileName = download.suggestedFilename()

  await download.saveAs(`/Users/neal/workspace/lexome/packages/server/scraped/books/${fullFileName}`)

  // create folder with file name


  // // find meta tag with attribute http-equiv="refresh"
  // await page.waitForSelector('meta[http-equiv="refresh"]')

  // // get content attribute
  // const content = await page.$eval('meta[http-equiv="refresh"]', el => el.getAttribute('content'))

  // // split content by url=
  // const urlParts = content.split('url=')

  // // get second part
  // const downloadUrl = urlParts[1]

  // // download the file and save it to disk
  // await page.goto(downloadUrl)

  // await page.waitForTimeout(5000)

  // await browser.close()
}

export const getEbookLinks = async () => {
  const browser =  await playwright.chromium.launch({ headless: true })
  const context = await browser.newContext()

  const page = await context.newPage()

  await page.goto('https://standardebooks.org/ebooks?query=&sort=newest&view=grid&per-page=48')

  await page.waitForSelector('ol.ebooks-list')

  let linksToProcess: string[] = []

  const evaluatePage = async () => {
    const links = await page.evaluate((linksToProcess) => {
      const books = Array.from(document.querySelectorAll('ol.ebooks-list li'))

      const links: string[] = []

      books.forEach((book) => {
        const link = book.querySelector('a[property="schema:url"]')?.getAttribute('href')

        if (link) {
          links.push(link)
        }
      })

      return links
    })

    linksToProcess = linksToProcess.concat(links)
  }

  await evaluatePage()

  // Has button with text 'Next' and button is not disabled
  let hasNext = await page.evaluate(() => {
    return Boolean(document.querySelector('a[rel="next"]'))
  })

  while (hasNext) {
    await page.click('a[rel="next"]')
    await page.waitForTimeout(1000)
    await evaluatePage()

    hasNext = await page.evaluate(() => {
      return Boolean(document.querySelector('a[rel="next"]'))
    })

    console.log('hasNext', hasNext)
  }

  return linksToProcess
}

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

const saveEbookLinks = async () => {
  const ebookLinks = await getEbookLinks();
  const writePath = path.join(outputDir, 'ebook-links.json')
  fs.writeFileSync(writePath, JSON.stringify(ebookLinks, null, 2))
}

const loadEbookLinks = async () => {
  const readPath = path.join(outputDir, 'ebook-links.json')
  const ebookLinks = fs.readFileSync(readPath, 'utf8')
  return JSON.parse(ebookLinks)
}

const createSlugSets = (ebookLinks: string[]) => {
  const authorSlugs = new Set<string>()
  const titleSlugs = new Set<string>()

  for (const book of ebookLinks) {
    const bookParts = book.split('/')
    const author = bookParts[2]
    const title = bookParts[3]

    authorSlugs.add(author)
    titleSlugs.add(title)
  }

  return { authorSlugs, titleSlugs }
}

const getDownloadedBooks = async () => {
  const storage = new Storage();
  const bucketName = 'standard-ebooks';
  const bucket = storage.bucket(bucketName);

  const [files] = await bucket.getFiles({
    prefix: 'books/'
  });
  return files.map(file => file.name);
}

const extractAuthorAndTitle = (params: {
  bookString: string,
  authorSet: Set<string>,
}) => {
  const { bookString, authorSet } = params

  let cleanedBookString = bookString.replace('books/', '')

  let bookparts = cleanedBookString.split('_')

  let authorSlug = ''
  let titleSlug = ''

  // find longest concatation of book parts that is in author set
  for (let i = bookparts.length; i > 0; i--) {
    const testAuthorSlug = bookparts.slice(0, i).join('_')

    if (authorSet.has(testAuthorSlug)) {
      authorSlug = testAuthorSlug
      titleSlug = bookparts[i]
    }
  }

  return {
    authorSlug,
    titleSlug
  }
}

const getAuthorIds = async (params: {
  authorSlug: string
}) => {
  const { authorSlug } = params

  const authors = authorSlug.split('_').map(formatAuthorDisplayName)

  const authorIds: string[] = []

  for (const author of authors) {
    const authorRecord = await prisma.author.findFirst({
      where: {
        display_name: author
      }
    })

    if (!authorRecord) {
      const newAuthor = await prisma.author.create({
        data: {
          display_name: author
        }
      })

      authorIds.push(newAuthor.id)
      
    } else {
      authorIds.push(authorRecord.id)
    }
  }

  return authorIds
}

const main = async () => {
  const ebookLinks = await loadEbookLinks();
  const {
    authorSlugs,
  } = createSlugSets(ebookLinks)

  const downloadedBooks = await getDownloadedBooks()

  for (const book of downloadedBooks) {
    const epubUrl = `https://storage.googleapis.com/standard-ebooks/books/${book}`
    const coverUrl = `https://storage.googleapis.com/standard-ebooks/covers/${book}`.replace('.epub', '.jpg')

    const { authorSlug, titleSlug } = extractAuthorAndTitle({
      bookString: book,
      authorSet: authorSlugs,
    })

    if (!authorSlug) {
      console.log('no author slug found for', book)
      continue
    }

    const bookTitle = formatBookTitle(titleSlug.replace('.epub', ''))
    const bookRecord = await prisma.book.findFirst({
      where: {
        title: bookTitle
      }
    })

    const authorIds = await getAuthorIds({ authorSlug })

    if (!bookRecord) {
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
    }
  }
}

  //     await prisma.book.update({
  //       where: {
  //         id: bookRecord.id
  //       },
  //       data: {
  //         authors: {
  //           connect: authorIds.map((id) => ({ id }))
  //         }
  //       }
  //     })

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
  // }

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

export default main
