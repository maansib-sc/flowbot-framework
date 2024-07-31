import UserModel from "@/models/userModel";

import { NextApiRequest } from "next";

export default async function handler( req: NextApiRequest, res: any) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Only POST method is allowed' });
        }

        console.log(`body is`, req.body);
        const conversationId: string = req.body?.identifierValue || '';
        const userDoc = await UserModel.findById(conversationId)

        if ( userDoc) {
            console.log(`we are going to update handover status of the user;`);
            await UserModel.findByIdAndUpdate(conversationId, { 
                handOverEnabled: false
            })
        }
        
        const io = res?.socket?.server?.io;
        if (io) {
          // here we will be emitting the message to that specific room with the conversation/leadId;
          const message: string = 'Thanks for connecting with our customer support team. Feel free to ask any queries from chatbot'
          io.in(conversationId).emit('updateMessageState', message);
          console.log('event emitted successfully');
        }
            
        return true;
    } catch (error) {
        console.log(`something went wrong in resolving chat ${error}`);
        return false;
    }
}
