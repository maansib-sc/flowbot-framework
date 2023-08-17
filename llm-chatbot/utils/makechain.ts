import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { LLMChain, loadQAStuffChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `
context: {context}
Use the above context to answer the following question.

Question: {question}

Output Instructions: 
If the question is not related to the context, politely respond with "Please ask questions related to the given context”.
If the answer to the given question does not lie in the given context, respond with "I am sorry, the context does not provide enough information". DO NOT try to make up an answer.
`;

// const QA_PROMPT = `Context: {context} \n\n Question: {question} \n\n Try answering Question using Context. 
// Please ensure your responses are in American English and strictly pertain to the topic of HR solutions, Lanteria HR solutions and HR. 
// If a question doesn't pertain to this topic, kindly respond with "Please ask questions related to HR Management". `

export class makeChain {
  vectorstore: PineconeStore;
  model: OpenAI;

  constructor(vectorstore: PineconeStore) {
    this.vectorstore = vectorstore;
    this.model = new OpenAI({
      temperature: 0, // increase temepreature to get more creative answers
      modelName: 'gpt-4', //change this to gpt-4 if you have access
    });
  }

  run = async (inputQuestion: string) => {

    let docs = await this.vectorstore.asRetriever().getRelevantDocuments(inputQuestion);

    if (docs.length === 0) {
      // Raise an exception if the docs array is empty
      throw new Error("No documents found. Please train the chatbot.");
    }
    
    console.log("docs ==>", docs)
    

    function isSentence(str: string) {
      let val = str.includes(' ');
      // console.log("isSentence ==>", val, str)
      return val
    }

    if (!isSentence(docs[0].pageContent)) {
      const template = `Given the text of question, it is your job to write a answer.
      If you dont have answer, politely respond with "I am sorry, I don't have enough information".

      Question: {text}
      Answer:
      `
      const prompt_template = new PromptTemplate({
        inputVariables: ["text"],
        template: template,
      });
      
      const gptchain = new LLMChain({ llm: this.model, prompt: prompt_template })
      // console.log("inside gpt chain")
      let obj = { 'text': "", "src": "gpt4" }
      obj.text = await gptchain.run(inputQuestion);
      // console.log("result from chatgpt", obj)

      return obj
    } else {
      const inputs = {
        question: inputQuestion,
        input_documents: docs,
        chat_history: [],
      };
      const qa_prompt = PromptTemplate.fromTemplate(QA_PROMPT);
      // console.log("qa_prompt ==>", qa_prompt)
      let result = await loadQAStuffChain(this.model, { prompt: qa_prompt }).call(inputs);
      // console.log("result from wikibase ===>", result)
      
      // Enable this if you want to enable chat gpt
      // Todo to enable/disbale with help with env
      var is_gpt4_enabled = false;
      if (result.text.includes("I am sorry,") && is_gpt4_enabled) {
        const template = `Given the text of question, it is your job to write a answer.
        If you dont have answer, politely respond with "I'm sorry, I don't have enough information".
  
        Question: {text}
        Answer:
        `
        const prompt_template = new PromptTemplate({
          inputVariables: ["text"],
          template: template,
        });

        const gptchain = new LLMChain({ llm: this.model, prompt: prompt_template })
        //.console.log("inside gpt chain")
        let obj = { 'text': "", "src": "gpt4" }
        obj.text = await gptchain.run(inputQuestion);
        // console.log("result from chatgpt", obj)

        return obj
      }
      result.src = "talkingDb"

      return result;
    }
  }
};
