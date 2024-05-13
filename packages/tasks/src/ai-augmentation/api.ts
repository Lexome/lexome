// import Groq from 'groq-sdk'

// const groq = new Groq({
//     apiKey: API_KEY
// });
// const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';

import 'dotenv/config'

const OPENAI_KEY = process.env.OPENAI_KEY
const GROQ_KEY = process.env.GROQ_KEY

const gptUrl = 'https://api.openai.com/v1/chat/completions'
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${OPENAI_KEY}`
}
const scaffoldApiData = {
  model: "gpt-4-turbo",
  response_format: { "type": "json_object" },
}

// type PromptParams = Parameters<typeof groq.chat.completions.create>
// type BodyParam = Omit<PromptParams[0], 'model'>

type Params = {
  messages: {
    content: string,
    role: 'system' | 'user'
  }[],
  retries?: number,
  verify?: (response: any) => boolean
}

export const prompt = async (params: Params) => {
  const { retries = 0, verify = () => true, messages } = params

  try {
    // let response = await groq.chat.completions.create({
    //   ...params,
    //   model: 'llama3-8b-8192',
    //   response_format: {
    //     type: 'json_object'
    //   },
    //   stream: false
    // })

    const rawResponse = await fetch(gptUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...scaffoldApiData,
        messages
      })
    })
    const responseJson = await rawResponse.json()

    const responseText = responseJson?.choices[0]?.message.content
    const parsed = parseResponse(responseText)

    if (verify(parsed)) {
      return parsed
    } else {
      throw new Error('Verification failed')
    }

  } catch (e) {
    if (retries >= 5) {
      throw e
    }

    return new Promise((resolve) => {
      setTimeout(async () => {
        console.log('Retrying prompt')

        const result = await prompt({
          ...params,
          retries: retries + 1
        })
        resolve(result)
      }, 30000)
    })
  }
}

const parseResponse = (output: string) => {
  const shaveTopLinesLimit = 10;
  const shaveBottomLinesLimit = 5;

  const outputLines = output.split('\n')

  for (let i = 0; i < shaveTopLinesLimit; i++) {
    for (let j = 0; j < shaveBottomLinesLimit; j++) {
      try {
        const shavedLines = outputLines.slice(
          i,
          outputLines.length - j
        )
        
        const shaved = shavedLines.join('\n')
        return JSON.parse(shaved)
      } catch {}
    }
  }

  throw new Error('could not parse response')
}


