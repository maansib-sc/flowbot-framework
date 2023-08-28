import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { LLMChain, loadQAStuffChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { Document } from 'langchain/document';
import axios from 'axios';


const QA_PROMPT = `
{context}

Instructions for finding answer to the following question and displaying output:
Search the answer for the question inside "content" keys present in above "context" key.
If you find the answer:
	- Always end your answer with this line: More information at <value of the "content_source" key of the "content" you find answer from>. <value of the "content_source" key of the "content" you find answer from> can have multiple values if answer is found is multiple "content" keys.
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

  constructor(vectorstore: PineconeStore) {
    this.vectorstore = vectorstore;
    this.model = new OpenAI({
      temperature: 0.7, // increase temepreature to get more creative answers
      modelName: 'gpt-4', //change this to gpt-4 if you have access
    });
  }

  run = async (inputQuestion: string) => {
    const textSimilarityApi = "https://shipbot-helper.smarter.codes/shipbot/similarity";
    let retriever = this.vectorstore.asRetriever(25)
    let queryParams = {
      'k': "5",
      'question': inputQuestion
    };
    let requestData = {}
    let docs:Array<Document> = await retriever.getRelevantDocuments(inputQuestion);

    if (docs.length == 0) {
      const ignoranceTemplate = "I am sorry, I do not have enough information to give answer!"
      let obj = { 'text': ignoranceTemplate, "src": "talkingDB" }
      return obj
    }else {
      type contextItem = {
        content: Array<string>;
        content_source: string;
      };
      type contextItemArray = contextItem[];
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

      //create prompt template
      let qaPrompt = PromptTemplate.fromTemplate(QA_PROMPT);

      // debug prompts
      let paramValues = {"question": inputQuestion, "context":JSON.stringify({"context": JSON.stringify(similarDocs)})}
      let formattedQAPrompt = await qaPrompt.format(paramValues);
      // let kbResponse = {"text": formattedQAPrompt, "src":"talkingDB"}
      console.log(formattedQAPrompt)

      // create chain
      let kbResponseChain = new LLMChain({ llm: this.model, prompt: qaPrompt });
      let kbResponse = await kbResponseChain.call({ question: inputQuestion, context: JSON.stringify({"context": similarDocs}) })

      if (kbResponse.text.includes("I am sorry,")) {
        const ignorance_template = "I am sorry, I do not have enough information to give answer!"
        let obj = { 'text': ignorance_template, "src": "talkingDB" }
        return obj
      }

      kbResponse.src = "talkingDb"

      return kbResponse;  
    }
  }
};
