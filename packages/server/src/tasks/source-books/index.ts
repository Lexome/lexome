import * as path from "path";
import * as fs from "fs";
import { downloadBook, getEbookLinks } from "./scrapeStandardEbooks";
import { findPackageRoot } from "../utils";
import e = require("express");

const packageRoot = findPackageRoot()

if (!packageRoot) {
  throw new Error('Could not find package root')
}

const outputDir = path.join(packageRoot, 'scraped')

const main = async () => {
  // const ebookLinks = await getEbookLinks();

  // console.log('links', ebookLinks)

  // Write to file
  // const writePath = path.join(outputDir, 'ebook-links.json')
  // fs.writeFileSync(writePath, JSON.stringify(ebookLinks, null, 2))

  const booksList = fs.readFileSync(path.join(outputDir, 'ebook-links.json'), 'utf8')
  const books = JSON.parse(booksList)

  for (let i = 0; i < books.length; i++) {
    console.log(`downloading book ${i + 1} of ${books.length}`)
    const book = books[i]

    await downloadBook('https://standardebooks.org' + book)
  }
}

main()