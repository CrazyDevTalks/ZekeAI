// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAIStream } from "../../lib/openAIStream";

if (!process.env.NEXT_OPENAI_API_KEY )
  throw new Error("NEXT_OPENAI_API_KEY  is not defined");

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { prompt } = await req.json();
  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.5,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 100,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
