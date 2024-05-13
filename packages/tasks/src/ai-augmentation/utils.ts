export const chapterStartRegex = /CHAPTER\s*\S{0,5}/

export const fuzzyParseJson = (jsonString: string) => {
  const maxShavedLinesStart = 10
  const maxShavedLinesEnd = 5

  const jsonLines = jsonString.split('\n')

  for (let i = 0; i < maxShavedLinesStart; i++) {
    for (let j = 0; j < maxShavedLinesEnd; j++) {
      const shaved = jsonLines.slice(i, jsonLines.length - j).join('\n')

      try {
        return JSON.parse(shaved)
      } catch (e) {
      }
    }
  }

  throw new Error('Could not parse JSON')
}