import { v4 as uuidv4 } from 'uuid'

import { HashBoundary, hashWords, prepareTextForHash } from "../hash";
import { readChaptersForBook } from "../processing/parseBooks";
import { prompt } from "../prompt";
import { Summary } from "./schemas/summary-v1";
import { saveLog } from '../../utils';

const startOfBookIntro = `
The chapter you will receive is the first chapter of the book.
`

const createPreviousSummaryIntro = (params: {
  chapterNumber: number,
  previousSummary: string
}) => `
You are about to receive chapter ${params.chapterNumber} of the book.
The book's preceding chapters have already been summarized.
This is the summary of the previous chapters:

${params.previousSummary}

END OF SUMMARY
`

const systemPrompt = `
You are a precise and objective storyteller. Your task is to summarize the events of a single chapter from a book.
`

const startOfBookInstructions = `
1. Summarize the main events of the first chapter in chronological order.
2. Focus exclusively on actions, occurrences, and factual developments in this chapter's plot.
3. Avoid interpretations, character analysis, or thematic discussions.
4. Keep the language clear, concise, and objective.
5. Reduce the total length of the chapter content by approximately 90%, focusing on the most important events.
6. Ensure your summary of the new chapter can stand alone, but also logically follow the previous summary.
7. Include the chapter title in your summary
8. Output the summary as prose, not as a list
`

const continueBookInstructions = `
1. Read the previous summary to understand the context, but do not modify or incorporate it into your new summary.
2. Summarize the main events of the new chapter in chronological order.
3. Focus exclusively on actions, occurrences, and factual developments in this chapter's plot.
4. Avoid interpretations, character analysis, or thematic discussions.
5. Keep the language clear, concise, and objective.
6. Reduce the total length of the chapter content by approximately 90%, focusing on the most important events.
7. Ensure your summary of the new chapter can stand alone, but also logically follow the previous summary.
8. Include the chapter title in your summary
9. Output the summary as prose, not as a list
`

// Summary prompt
const summarizeNewChapterUserPrompt = (params: {
  introInstructions: string,
  chapterContent: string,
  isFirstChapter: boolean
}) => `
${params.introInstructions}

This is the chapter you will summarize:

${params.chapterContent}

END OF CHAPTER

Instructions:

${params.isFirstChapter ? startOfBookInstructions : continueBookInstructions}

Provide a concise summary of this chapter's events only. The goal is to create a factual recap of what happens in this specific chapter, while being aware of but not explicitly referencing the context from previous chapters.
`;

const summarizeNewChapterAssistantPrefill = 'SUMMARY:'


export const summarizeBookChapters = async (params: {
  bookId: string,
  shouldSave?: boolean
}): Promise<Summary> => {
  const { shouldSave, bookId } = params

  const chapters = await readChaptersForBook({ bookId })

  const chapterSummaries: Summary["chunks"] = []

  let previousSummary = ''
  let chapterIndex = 0

  for (const chapter of chapters) {
    const previousSummaryIntro = createPreviousSummaryIntro({
      chapterNumber: chapterIndex + 1,
      previousSummary
    })

    const userPrompt = summarizeNewChapterUserPrompt({
      introInstructions: chapterIndex === 0
        ? startOfBookIntro
        : previousSummaryIntro,
      chapterContent: chapter,
      isFirstChapter: chapterIndex === 0
    })

    const summary = await prompt({
      systemPrompt,
      userPrompt,
      prefilled: summarizeNewChapterAssistantPrefill
    })

    const chapterWords = prepareTextForHash({ text: chapter })
    const endOfChapterHash = await hashWords({
      words: chapterWords,
      boundary: HashBoundary.END
    })

    chapterSummaries.push({
      id: uuidv4(),
      text: summary,
      anchor: {
        id: uuidv4(),
        word: chapterWords[chapterWords.length - 1],
        prefixHash: endOfChapterHash,
      }
    })

    previousSummary += summary
    chapterIndex++
  }

  saveLog({
    message: {
      chunks: chapterSummaries
    }
  })

  return {
    chunks: chapterSummaries
  }
}


