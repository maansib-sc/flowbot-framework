import type { NextApiRequest, NextApiResponse } from 'next';
import { makeChain } from '@/utils/makechain';
import dbConnect from '@/config/mongodb';
import { upsertSubscription } from '@/models/subscriptionModel';
import { upsertUser } from '@/models/userModel';
import axios from 'axios';
import { BigQuery } from '@google-cloud/bigquery';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { GoogleAuth } from 'google-auth-library';
const parser = require('@babel/parser');
const generator = require('@babel/generator');
const fs = require('fs-extra');
const FormData = require('form-data');
const json5 = require('json5');
import path from 'path';
const { htmlToText } = require('html-to-text');

export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history, enablegptfallback, session } = req.body;
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

    const headers = req.headers;

    return new Promise((resolve, reject) => {
      import(`@/configuration/${chatBotId}/server`)
        .then(async (module) => {
          try {
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
                chatBotId,
                headers,
                parser,
                generator,
                json5,
                htmlToText,
              },
              sanitizedQuestion,
            );
            res.status(200).json(response);
            resolve(response);
          } catch (error: any) {
            res
              .status(500)
              .json({ error: error?.message || 'Something went wrong' });
            console.log(error);
            resolve(error);
          }
        })
        .catch((error) => {
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
                chatBotId,
                headers,
                parser,
                generator,
                json5,
                htmlToText,
              },
              sanitizedQuestion,
            );
            res.status(200).json(response);
            resolve(response);
          });
        });
    });
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
