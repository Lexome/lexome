import { v4 as uuidv4 } from 'uuid'

import { addSummaryToBook } from "../../services/enhancements/addSummaryToBook";
import { saveLog } from "../../utils";
import { summarizeBookChapters } from '../../services/enhancements/summarizeBookChapters';

export default async function main() {
  const summary = await summarizeBookChapters({
    bookId: "23da3203-f937-46ea-910f-a98b3bcc49e1",
  })

  saveLog({
    message: summary
  })

  await addSummaryToBook({
    bookId: "23da3203-f937-46ea-910f-a98b3bcc49e1",
    summary,
  })
}
