import type { NextApiRequest, NextApiResponse } from 'next';
import UserModel from "@/models/userModel";

export default async function handler(req: NextApiRequest, res: any) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST method is allowed' });
    }
    console.log('request received:', req.body);
    const io = res?.socket?.server?.io;
    if (io) {
      // here we will be emitting the message to that specific room with the conversation/leadId;
      const roomId: string = req.body?.leadId;
      const message: string = req.body?.body;

      // first, we have to verify that the chatbot is still open to hear or already resolved;
      const userDoc = await UserModel.findById(roomId)

      if ( userDoc && userDoc?.handOverEnabled ) {
        io.in(roomId).emit('updateMessageState', message);
        console.log('event emitted successfully');
      } else {
        console.log(`chat is already resolved`);
        return res.status(200).json({ success: false, message: 'chat is already resolved', from: "+19804493888", to: "+19804493888" });
      }
    }

    return res.status(200).json({ success: true, message: 'request processed successfully', from: "+19804493888", to: "+19804493888" });
  } catch (error) {
    console.error(`something went wrong ${error}`);
    return res.status(500).json({ success: false, message: 'internal server error', from: "+19804493888", to: "+19804493888" });
  }
}
