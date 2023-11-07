import type { NextApiRequest, NextApiResponse } from 'next';
import { makeChain } from '@/utils/makechain';
import dbConnect from '@/config/mongodb';
import { upsertSubscription } from '@/models/subscriptionModel';
import { upsertUser } from '@/models/userModel';
import axios from 'axios';
import { BigQuery } from '@google-cloud/bigquery';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { question, history, enablegptfallback, session } = req.body;
    const { pinecone_name_space } = req.query;
    console.log('question', question, session);

    await dbConnect()

    //only accept post requests
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    // OpenAI recommends replacing newlines with spaces for best results
    const sanitizedQuestion = question;
    // const sanitizedQuestion = question.trim().replaceAll('\n', ' ');


    try {
        //create chain
        const chain = new makeChain(pinecone_name_space);

        const user = await upsertUser(pinecone_name_space, session)

        import(`@/configuration/JS/${pinecone_name_space}`).then(async (module) => {
            const response = await module.start({ chain, axiosInstance: axios, user, BigQuery }, sanitizedQuestion)
            if (response) {
                return res.status(200).json(response);
            }
        }).catch((error) => {
            import(`@/configuration/JS/default`).then(async (module) => {
                const response = await module.start({ chain, axiosInstance: axios, user, BigQuery }, sanitizedQuestion)
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
