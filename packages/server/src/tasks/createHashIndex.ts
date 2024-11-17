import { saveHashOrderingForBook } from "../services/processing/parseBooks"

const BOOK_ID = "23da3203-f937-46ea-910f-a98b3bcc49e1"

export default async function main() {
  await saveHashOrderingForBook({
    bookId: BOOK_ID,
  })
}
