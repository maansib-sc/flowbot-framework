import type { NextApiRequest, NextApiResponse } from 'next';
import { makeChain } from '@/utils/makechain';
import dbConnect from '@/config/mongodb';
import { upsertSubscription } from '@/models/subscriptionModel';
import { upsertUser } from '@/models/userModel';
import axios from 'axios';
import { BigQuery } from '@google-cloud/bigquery';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { GoogleAuth } from 'google-auth-library';
const fs = require('fs');
const FormData = require('form-data');
import path from 'path';

export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history, enablegptfallback, session, reqQuery } = req.body;
  const { pinecone_name_space } = req.query;
  const chatBotId = String(pinecone_name_space || 'default');
  // console.log('question', question, session);

  await dbConnect();

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
    const chain = new makeChain(chatBotId);

    const user = await upsertUser(chatBotId, session);

    import(`@/configuration/${chatBotId}/server`)
      .then(async (module) => {
        const response = await module.start(
          {
            chain,
            axiosInstance: axios,
            user,
            BigQuery,
            DocumentProcessorServiceClient,
            GoogleAuth,
            fs,
            path,
            FormData,
            reqQuery
          },
          sanitizedQuestion,
        );
        if (response) {
          return res.status(200).json(response);
        }
      })
      .catch((error) => {
        console.log("error ==>", error)
        import(`@/configuration/default/server`).then(async (module) => {
          const response = await module.start(
            {
              chain,
              axiosInstance: axios,
              user,
              BigQuery,
              DocumentProcessorServiceClient,
              GoogleAuth,
              fs,
              path,
              FormData,
            },
            sanitizedQuestion,
          );
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
