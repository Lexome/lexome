export enum ChunkMethod {
  SENTENCE = 'sentence',
  PARAGRAPH = 'paragraph',
}

type ChunkParams = {
  text: string;
  method: ChunkMethod;
}


export const chunkText = ({ text, method }: ChunkParams) => {
  if (method === ChunkMethod.SENTENCE) {
    return text.split(/[.!?]/).filter(Boolean);
  }

  return text.split(/\n+/).filter(Boolean);
}

  // Determine the number of segments to split the chunk into to keep the word count per
  // segment under the max word limit

  // The purpose of this is to find a word limit that keeps each segment under the max word limit
  // and roughly equal in length
export const findEqualChunkSize = ({
  textLength,
  maxWordLimit
}: {
  textLength: number,
  maxWordLimit: number
}) => {
  let numSegments = 1

  for (let i = 1; i <= textLength; i++) {
    if (textLength / i <= maxWordLimit) {
      numSegments = i;
      break
    }
  }

  return textLength / numSegments;
}

// Split a chunk into processable chunks, with a word limit
export const breakChunkIntoProcessableSegments = (params: {
  chunk: string;
  wordLimit: number;
}): string[] => {
  const { chunk, wordLimit: maxWordLimit=4000 } = params;

  const chunkLength = chunk.split(' ').length

  if (chunkLength <= maxWordLimit) {
    return [chunk];
  }

  const wordLimit = findEqualChunkSize({
    textLength: chunkLength,
    maxWordLimit
  });

  const processableSegments: string[] = [];

  const paragraphs = chunk.split("\n").filter(Boolean);

  let workingSegment: string = ""
  let wordCount = 0;

  for (const paragraph of paragraphs) {
    const paragraphWordCount = paragraph.split(" ").length;
    wordCount += paragraphWordCount;

    // Add the paragraph to the working chunk
    workingSegment += workingSegment ? `\n${paragraph}` : paragraph;

    // If the working chunk has reached the word limit, add it to the processable chunks
    // And reset the working chunk

    // EXCEPTION: Don't start a new chunk on a paragraph that is a line of dialogue
    if (
      wordCount > wordLimit &&
      !["“", "”"].includes(paragraph[0])
    ) {
      processableSegments.push(workingSegment);
      workingSegment = "";
      wordCount = 0;
    }
  }

  if (workingSegment) {
    processableSegments.push(workingSegment);
  }

  return processableSegments;
}

