import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

import path from 'path';


export default async function main() {
  // const summary = await summarizeBookChapters({
  //   bookId: "23da3203-f937-46ea-910f-a98b3bcc49e1",
  // })


  const summaryJsonText = fs.readFileSync(path.join(process.cwd(), 'logs/summary.json'), 'utf8')
  const summary = JSON.parse(summaryJsonText)

  for (const chunk of summary.chunks) {
    console.log(chunk.text) 
  }

  // saveLog({
  //   message: summary
  // })

  // await addSummaryToBook({
  //   bookId: "23da3203-f937-46ea-910f-a98b3bcc49e1",
  //   summary,
  // })
}
