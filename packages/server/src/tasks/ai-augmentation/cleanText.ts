import { chapterStartRegex } from "./utils"

export const cleanForAnalysis = (originalText: string) => {
  let newText = originalText

  const textsToReplace: {
    textToReplace: string,
    replacementText: string,
  }[] = []

  // Find sections of text demarcated by /* and */
  // These are places of the book text that are formatted a certain
  // The contents of these sections should be kept
  // Sometimes the first word of these sections is all caps
  // which refers to a specific sort of formatting to be applied
  // These first words should be removed and the rest of the text should be kept
  for (let i = 0; i < newText.length; i++) {
    if (newText[i] === '/' && newText[i + 1] === '*') {
      const start = i
      i += 2
      while (newText[i] !== '*' || newText[i + 1] !== '/') {
        i++
      }
      const end = i
      const textToReplace = newText.slice(start, end + 2)

      // Remove /* and */ from the text to replace
      let replacementText = textToReplace.replace('/*', '')
      replacementText = replacementText.replace('*/', '')

      const replacementTextSections = replacementText.split(' ')

      const firstWord = replacementTextSections.find((word) => {
        return word !== '/*' && word !== ''
      })

      if (
        firstWord &&
        firstWord === firstWord.toUpperCase()
      ) {
        replacementText = replacementText.replace(firstWord, '')
      }

      textsToReplace.push({
        textToReplace,
        replacementText,
      })
    }
  }

  // Remove all sections starting with [Illustration: and ending with]
  for (let i = 0; i < newText.length; i++) {
    if (newText[i] === '[') {
      const start = i
      let bracketStack = 1
      while (bracketStack > 0 && i < newText.length) {
        i++
        if (newText[i] === '[') {
          bracketStack++
        } else if (newText[i] === ']') {
          bracketStack--
        }
      }
      const end = i
      const textToReplace = newText.slice(start, end + 1)

      const uppercaseText = textToReplace.toUpperCase()

      // If the text to replace containers a chapter start regex, then keep just the chapter,
      // otherwise remove the entire section
      if (chapterStartRegex.test(uppercaseText)) {
        const chapterMatch = uppercaseText.match(chapterStartRegex)
        if (chapterMatch) {
          //  newText.replace(textToReplace, chapterMatch[0])
          textsToReplace.push({
            textToReplace,
            replacementText: chapterMatch[0],
          })
        }
      } else {
        textsToReplace.push({
          textToReplace,
          replacementText: '',
        })
      }
    }
  }

  textsToReplace.forEach(({ textToReplace, replacementText }) => {
    newText = newText.replace(textToReplace, replacementText)
  })

  // Remove all leading and trailing underscores from words
  newText = newText.replace(/(\b_+|\B_+|_+\b|_+\B)/g, '')

  return newText
}

export const cleanForHashing = (originalText: string) => {
  // Split the text by whitespace or any form of dashes
  let newText = originalText.split(/[\s-—\,]+/).join(' ')

  // Remove all forms of non-alphanumeric characters
  newText = newText.replace(/[^a-zA-Z0-9\s]/g, '')

  // Collapse white space
  newText = newText.split(/\s+/).join(' ')

  return newText
}