import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { makeChain } from '@/utils/makechain';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history } = req.body;
  const pinecone_name_space = req.query.pinecone_name_space;
  console.log('question', question);
  const hiKeywords = ['hi', 'hello', 'hey', 'hi!'];
  const hiResposeMessage = process.env.NEXT_PUBLIC_HI_MESSAGE_RESPONSE

  //only accept post requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (hiKeywords.includes(question.toLowerCase())) {
    res.status(200).json({ text: hiResposeMessage });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: pinecone_name_space || PINECONE_NAME_SPACE,//namespace comes from your config folder
      },
    );

    //create chain
    const chain = new makeChain(vectorStore, pinecone_name_space);

    const response = await chain.run(sanitizedQuestion)
    if (response) {
      res.status(200).json(response);

    }
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
