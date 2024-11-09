import Anthropic from '@anthropic-ai/sdk'
import OpenAi from 'openai'
import dotenv from 'dotenv'
import fs from 'fs'
import { initializeTempDirectory, TEMP_DIRECTORY } from '../utils'
import path from 'path'

dotenv.config()

const DEFAULT_MODEL = "claude-3-5-sonnet-20240620"

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export const audioPrompt = async (params: {
  text: string
}): Promise<Buffer> => {

  initializeTempDirectory()

  const openAi = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY,
    organization: "org-JCAMTm11IgUnJa7h8Vfi9Fd1"
  })

  const response = await openAi.chat.completions.create({
    model: "gpt-4o-audio-preview",
    modalities: ["text", "audio"],
    audio: { voice: "onyx", format: "mp3" },
    messages: [
      {
        role: "system",
        content: `You are an audiobook narrator. You will be given a text and you will need narrate the text
        in a way that is engaging, interesting, and easy to understand. Your narration should only include the text and nothing else.
        You should not include any other commentary or commentary on the text.`
      },
      {
        role: "user",
        content: params.text
      }
    ]
  });

  if (response.choices[0]?.message?.audio?.data) {
    return Buffer.from(response.choices[0]?.message?.audio?.data, 'base64')
  } else {
    throw new Error("No audio data returned from OpenAI")
  }
}

type TranscriptionWord = {
  start: number
  end: number
  word: string
}

export const transcriptionPrompt = async (params: {
  audioBuffer: Buffer
}): Promise<TranscriptionWord[]> => {
  const openAi = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY,
    organization: "org-JCAMTm11IgUnJa7h8Vfi9Fd1"
  })

  const tempFile = path.join(TEMP_DIRECTORY, `${Date.now()}.mp3`)
  fs.writeFileSync(tempFile, params.audioBuffer)

  const response = await openAi.audio.transcriptions.create({
    file: fs.createReadStream(tempFile),
    model: "whisper-1",
    language: "en",
    timestamp_granularities: ["word"],
    response_format: "verbose_json",
  })

  // fs.unlinkSync(tempFile)
  return response.words || []
}

export const prompt = async (params: {
  systemPrompt?: string,
  userPrompt: string,
  prefilled?: string
}): Promise<string> => {
  const messages: Anthropic.Messages.MessageParam[] = []

  messages.push({ role: "user", content: params.userPrompt })
  
  if (params.prefilled) {
    messages.push({ role: "assistant", content: params.prefilled })
  }

  const msg = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 8192,
    system: params.systemPrompt,
    messages: messages,
  });

  try {
    const content = msg.content[0]
    const response = content.type === "text" ? content.text : ""
    return response

  } catch (e) {
    console.log(e)
    return ""
  }
}








