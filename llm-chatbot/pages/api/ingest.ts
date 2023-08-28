import { run } from '@/scripts/ingest-data';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const article  = req.body;

    // console.log("ingest api got hit ==>", article)

    //only accept post requests
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // if (!article) {
    //     return res.status(400).json({ message: 'No article in the request' });
    // }

    try {
        // Convert JSON object to a string
        // const jsonString = JSON.stringify(article);

        // Create a Blob from the JSON string
        // const blob = new Blob([jsonString], { type: 'application/json' });
        console.log(article)
        for (const item of article) {
            await run(item)
        }
        res.status(200).json({ msg: "article embedded in vectorDB" });
        

    } catch (error: any) {
        console.log('article error', error);
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
}
