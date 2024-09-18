import Epub from "epubjs";
import Section from "epubjs/types/section";

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
