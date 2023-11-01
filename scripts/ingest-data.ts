import { RecursiveCharacterTextSplitter, CharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import {Page} from '@/types/chat'

/* Name of directory to retrieve your files from 
   Make sure to add your PDF files inside the 'docs' folder
*/
const filePath = 'docs';

export const run = async (page: Page | Blob, pinecone_name_space: string) => {
  try {

    let pageNumber = page["page_number"];
    let pageBody = page["page_body"]
    let pageMetadata = {"page_number": pageNumber}
     /* Split text into chunks */
    const textSplitter = new CharacterTextSplitter({
      separator: "@@@@",
      chunkSize: 1,
      chunkOverlap: 0,
    });

    const docs = await textSplitter.createDocuments([pageBody], [pageMetadata])

    console.log('split docs', docs);

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

  //  embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: pinecone_name_space || PINECONE_NAME_SPACE,
      textKey: 'text',
    });
    return true
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};
