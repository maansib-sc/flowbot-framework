import { OpenAI } from 'langchain/llms/openai';
import GPT4Tokenizer from 'gpt4-tokenizer';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { LLMChain, loadQAStuffChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { Document } from 'langchain/document';
import { contextItem, contextItemArray } from '@/types/chat';
import axios from 'axios';


const QA_PROMPT = `
{context}

Instructions for finding answer to the following question and displaying output:
Search the answer for the question inside "content" keys present in above "context" key.
If you find the answer:
	- Always end your answer with this line: More information at <value of the "content_source" key of the "content" you find answer from>. <value of the "content_source" key of the "content" you find answer from> can have multiple values if answer is found in multiple "content" keys.
if you do not find the answer in the "context":
	- do not try to make up an answer. Respond with "I am sorry, I do not have enough information to give answer!"
If the question is not related to the context:
	- Politely respond with "Please ask questions related to PDF uploaded"

Question: {question}
`;

// const QA_PROMPT = `Context: {context} \n\n Question: {question} \n\n Try answering Question using Context. 
// Please ensure your responses are in American English and strictly pertain to the topic of HR solutions, Lanteria HR solutions and HR. 
// If a question doesn't pertain to this topic, kindly respond with "Please ask questions related to HR Management". `

export class makeChain {
  vectorstore: PineconeStore;
  model: OpenAI;
  chat_id: string;

  constructor(vectorstore: PineconeStore, chat_id: string) {
    this.vectorstore = vectorstore;
    this.chat_id = chat_id
    //can be configured
    this.model = new OpenAI({
      temperature: 0.7, // increase temepreature to get more creative answers
      modelName: 'gpt-4', //change this to gpt-4 if you have access
    });
  }
  token_limit_check = function (context: contextItemArray){
    const tokenizer = new GPT4Tokenizer({ type: 'gpt3' });
    let stringContext = JSON.stringify(context)
    let estimatedTokenCount = tokenizer.estimateTokenCount(stringContext);
    let contextLength = context.length;
    //can be configured
    while(estimatedTokenCount > 7000){
      contextLength = contextLength - 1;
      context = context.slice(0, contextLength);
      stringContext = JSON.stringify(context);
      estimatedTokenCount = tokenizer.estimateTokenCount(stringContext);
    }
    return context
  }
  run = async (inputQuestion: string) => {
    const textSimilarityApi = "http://35.238.41.105/staging/shipbot/similarity";
    //can be configured
    let top_k_docs = 10
    //can be configured
    let retriever = this.vectorstore.asRetriever(25)
    let queryParams = {
      'k': top_k_docs,
      'question': inputQuestion,
      'chat_id':this.chat_id
    };
    let requestData = {}
    let docs:Array<Document> = await retriever.getRelevantDocuments(inputQuestion);

    if (docs.length == 0) {
      const ignoranceTemplate = "I am sorry, I do not have enough information to give answer!"
      let obj = { 'text': ignoranceTemplate, "src": "talkingDB" }
      return obj
    }else {
      let sourceClassifiedDocs: contextItemArray = [];
      docs.map((doc: Document) => {
        let sourcePage = String(doc["metadata"]["page_number"]);
        let docContent = String(doc["pageContent"]);
        const hasSource = sourceClassifiedDocs.some((item: contextItem) => item.content_source === sourcePage);
        if (hasSource){
          let foundObject = sourceClassifiedDocs.find((item: contextItem) => item.content_source === sourcePage)
          if (typeof foundObject === 'object' && 'content' in foundObject && 'content_source' in foundObject) {
            foundObject["content"] = [...foundObject["content"], docContent]
          }
        }else{
          let newObject: contextItem = {"content": [docContent], "content_source": sourcePage}
          sourceClassifiedDocs = [...sourceClassifiedDocs, newObject]
        } 
      })
      requestData = JSON.stringify(sourceClassifiedDocs)
      const options = {
        method: 'POST',
        url: textSimilarityApi,
        params: queryParams,
        headers: {
          'content-type': 'application/json',
        },
        data: requestData
      };
    
      let textSimilarityApiResp = await axios.request(options)
      let similarDocs = textSimilarityApiResp.data


      // can be configured
      let max_tries = 3
      let chatbot_does_not_answer = true
      let current_try = 1
      //create prompt template
      let qaPrompt = PromptTemplate.fromTemplate(QA_PROMPT);
      // let kbResponse:chatbotResponse = {"text": "", "src": ""}
      let kbResponse = {}
      while(current_try <= max_tries && chatbot_does_not_answer && similarDocs.length > 0){
        //check token limit and slice similar docs
        console.log(`try no: , ${current_try}`)
        let slicedSimilarDocs = this.token_limit_check(similarDocs)
        // debug prompts
        let paramValues = {"question": inputQuestion, "context":JSON.stringify({"context": JSON.stringify(slicedSimilarDocs)})}
        let formattedQAPrompt = await qaPrompt.format(paramValues);
        console.log(formattedQAPrompt)
        //for debugging responses
        // kbResponse = {"text": "I am sorry, I do not have enough information to give answer!", "src":"talkingDB"}
        // create chain
        let kbResponseChain = new LLMChain({ llm: this.model, prompt: qaPrompt });
        kbResponse = await kbResponseChain.call({ question: inputQuestion, context: JSON.stringify({"context": slicedSimilarDocs}) })
        if(kbResponse.text.includes("I am sorry,")){
          let slicedSimilarDocsLength = slicedSimilarDocs.length
          similarDocs = similarDocs.slice(slicedSimilarDocsLength)
        }else{
          chatbot_does_not_answer = false
        }
        current_try = current_try + 1
      }
      if(chatbot_does_not_answer ==  true){
        const ignorance_template = "I am sorry, I do not have enough information to give answer!"
        let obj = { 'text': ignorance_template, "src": "talkingDB" }
        return obj
      }
      return kbResponse
      // kbResponse.src = "talkingDb"  
    }
  }
};
