import type { NextApiRequest, NextApiResponse } from 'next';
import { makeChain } from '@/utils/makechain';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history, enablegptfallback } = req.body;
  const { pinecone_name_space } = req.query;
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
    //create chain
    const chain = new makeChain(pinecone_name_space);

    const response = await chain.run(sanitizedQuestion)
    if (response) {
      res.status(200).json(response);
    }

  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
