// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextRequest } from 'next/server';
// import { OpenAIStream, OpenAIStreamEvent } from '../../lib/openAIStream';

// if (!process.env.OPENAI_API_KEY)
//   throw new Error('OPENAI_API_KEY is not defined');

// export const config = {
//   runtime: 'edge',
// };

// export default async function handler(req: NextRequest) {
//   const { prompt } = (await req.json()) as { prompt: string };
//   const payload: OpenAIStreamEvent = {
//     model: 'text-davinci-003',
//     prompt,
//     temperature: 0.5,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//     max_tokens: 100,
//     stream: true,
//     n: 1,
//   };

//   const stream = await OpenAIStream(payload);
//   return new Response(stream);
// }

import { OpenAI } from "langchain/llms";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";
import { ConversationChain } from "langchain/chains";


const template = `Assistant named Zeke is a large language model trained by Hub Culture.

Assistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

Assistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.

Overall, Assistant is a powerful tool that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist.

{history}
Human: {input}
Assistant:`;

const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["history", "input"],
});
const model = new OpenAI({ temperature: 0.7 });
const memory = new BufferMemory();
const chain = new ConversationChain({
  llm: model,
  prompt: prompt,
  memory: memory,
});

export default async function handler(req, res) {
  console.log("request", req);
  try {
    const chatResp = await chain.call({ input: req.query.message });
    console.log("chatResp", chatResp.response);
    res.status(200).json({ message: chatResp.response });
  } catch (error) {
    console.log("chatResp error", error);
  }
}
