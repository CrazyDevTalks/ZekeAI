// terminal commands
// bash: npm install langchain/llms

const { OpenAI } = require("langchain/llms");
const { BufferMemory } = require("langchain/memory");
const { PromptTemplate } = require("langchain/prompts");
const { ConversationChain } = require("langchain/chains");

const template = `Assistant named Zeke is a large language model trained by Hub Culture.

Assistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

Assistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.

Overall, Assistant is a powerful tool that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist.

User named {name} with HubID {hubID} and membership level {membershipLevel} is interacting with the assistant.

{history}
Human: {input}
Assistant:`;

const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["name", "hubID", "membershipLevel", "history", "input"],
});
const model = new OpenAI({ temperature: 0.7 });
const memory = new BufferMemory();
const chain = new ConversationChain({
  llm: model,
  prompt: prompt,
  memory: memory,
});

async function handler(req, res) {
  // chain.call function to pass the user's information to the model
  try {
    const chatResp = await chain.call({
      input: req.query.message,
      name: user_name,
      hubID: hubID,
      membershipLevel: membershipLevel,
    });
    res.status(200).json({ message: chatResp.response });
  } catch (error) {
    console.log("chatResp error", error);
  }
}
module.exports = handler;

// Testing prompts

const mockRequest = {
  query: { message: "Hi Zeke. Give me an example of a hubculture event." },
};
const mockResponse = {
  status: function() {
    return this;
  },
  json: function(obj) {
    console.log(obj);
  },
};

handler(mockRequest, mockResponse);
