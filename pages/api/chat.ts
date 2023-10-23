import type { NextApiRequest, NextApiResponse } from 'next';
import { makeChain } from '@/utils/makechain';
import dbConnect from '@/config/mongodb';
import { upsertSubscription } from '@/models/subscriptionModel';
import { upsertUser } from '@/models/userModel';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history, enablegptfallback, session } = req.body;
  const { pinecone_name_space } = req.query;
  console.log('question', question, session);
  const hiKeywords = ['hi', 'hello', 'hey', 'hi!'];
  const hiResposeMessage = process.env.NEXT_PUBLIC_HI_MESSAGE_RESPONSE

  await dbConnect()

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

    const user = await upsertUser(pinecone_name_space, session)

    import(`@/custom/JSFile/${pinecone_name_space}`).then(async (module) => {
      if (module.conversational) {
        const answ = module.ChatBotStep[user.lastStep]
        if (answ === undefined) return res.status(200).json({ "text": module.finalMessage, "src": "talkingDb" });
        return res.status(200).json({ "text": answ.question, "src": "talkingDb" });
      } else {
        const response = await module.start(chain, sanitizedQuestion)
        if (response) {
          return res.status(200).json(response);
        }
      }
    }).catch((error) => {
      import(`@/custom/JSFile/default`).then(async (module) => {
        const response = await module.start(chain, sanitizedQuestion)
        if (response) {
          return res.status(200).json(response);
        }
      });
    });

  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
