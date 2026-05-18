import type { NextApiRequest, NextApiResponse } from 'next';
import { cloneChatbot, deleteChatbot} from '@/utils/chatbots';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    try {
        
        if (req.method === 'POST') {
            const { chatbotId, newChatbotId } = req.body;
            if (chatbotId  && newChatbotId) {
                const status = await cloneChatbot(chatbotId, newChatbotId)
                if (status) return res.status(200).json({data : status});
            }
          } else {
            res.setHeader('Allow', ['POST']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
          }

    } catch (error: any) {
        console.log('error', error);
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
}
