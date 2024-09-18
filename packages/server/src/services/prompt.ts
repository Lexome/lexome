import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

dotenv.config()

const DEFAULT_MODEL = "claude-3-5-sonnet-20240620"

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

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








