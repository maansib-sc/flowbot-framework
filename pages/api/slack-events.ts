import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { type, challenge, event } = req.body;

      console.log("challenge",req.body)
  
      // URL verification challenge
      if (type === 'url_verification') {
        return res.status(200).json({ challenge });
      }
  
      // Event handling logic
      if (type === 'event_callback') {
        // Process the event
        console.log('Event received:', event);
  
        // Respond to Slack to acknowledge receipt
        return res.status(200).json({ message: 'Event received' });
      }
  
      // Other types of requests or unexpected data
      return res.status(400).json({ message: 'Invalid request' });
    }
  
    // Non-POST requests
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  