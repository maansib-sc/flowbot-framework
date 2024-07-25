import type { NextApiRequest, NextApiResponse } from 'next';
import { getJsTest } from '@/utils/test';
import { getChatbotsList } from '@/utils/chatbots';
import { Socket } from 'net';

function isSecureConnection(socket: Socket): boolean {
    // @ts-ignore: Check for the 'encrypted' property on the socket
    return socket.encrypted === true;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    try {
        
        if (req.method === 'GET') {
            const protocol = req.headers['x-forwarded-proto'] || (!isSecureConnection(req.socket) ? 'http' : 'https');
            const fullUrl = `${protocol}://${req.headers.host}`;

            const fileList = await getChatbotsList()
            let chatbotList = []

            if(fileList) {
                for (let item of fileList) {
                    chatbotList.push({"file": item, "url": `${fullUrl}/?chat-id=${item}`})
                }
            }

            return res.status(200).json({data : chatbotList});
          } else {
            res.setHeader('Allow', ['GET']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
          }

    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
}
