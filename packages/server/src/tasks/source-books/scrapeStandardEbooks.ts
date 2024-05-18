import playwright from 'playwright';

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
    console.log('clicking next')
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