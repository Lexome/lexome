import fs from "fs"
import path from "path"
import { breakChunkIntoProcessableSegments } from "../services/processing/chunk"
import { audioPrompt, transcriptionPrompt } from "../services/prompt"
import { TEMP_DIRECTORY, uploadFileToS3 } from "../utils"
import { generateAudioNarration } from "../services/enhancements/operations/generateAudioNarration"

// const sampleText = `
// “Tom!”

// No answer.

// “TOM!”

// No answer.

// “What’s gone with that boy,  I wonder? You TOM!”

// No answer.

// The old lady pulled her spectacles down and looked over them about the room; then she put them up and looked out under them. She seldom or never looked through them for so small a thing as a boy; they were her state pair, the pride of her heart, and were built for “style,” not service—she could have seen through a pair of stove-lids just as well. She looked perplexed for a moment, and then said, not fiercely, but still loud enough for the furniture to hear:

// “Well, I lay if I get hold of you I’ll—”

// She did not finish, for by this time she was bending down and punching under the bed with the broom, and so she needed breath to punctuate the punches with. She resurrected nothing but the cat.

// “I never did see the beat of that boy!”

// She went to the open door and stood in it and looked out among the tomato vines and “jimpson” weeds that constituted the garden. No Tom. So she lifted up her voice at an angle calculated for distance and shouted:

// “Y-o-u-u TOM!”

// There was a slight noise behind her and she turned just in time to seize a small boy by the slack of his roundabout and arrest his flight.

// “There! I might ’a’ thought of that closet. What you been doing in there?”

// “Nothing.”

// “Nothing! Look at your hands. And look at your mouth. What is that truck?”

// “I don’t know, aunt.”

// “Well, I know. It’s jam—that’s what it is. Forty times I’ve said if you didn’t let that jam alone I’d skin you. Hand me that switch.”

// The switch hovered in the air—the peril was desperate—

// “My! Look behind you, aunt!”

// The old lady whirled round, and snatched her skirts out of danger. The lad fled on the instant, scrambled up the high board-fence, and disappeared over it.
// `

const main = async (params: {
  bookId: string
}) => {
  const { bookId } = params

  const narration = await generateAudioNarration({
    bookId
  })

  console.log(narration)
  // console.log(url)
}

export default main
