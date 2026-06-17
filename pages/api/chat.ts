import type { NextApiRequest, NextApiResponse } from 'next';
import { makeChain } from '@/utils/makechain';
import dbConnect from '@/config/mongodb';
import { upsertSubscription } from '@/models/subscriptionModel';
import UserModel, { IUser, upsertUser } from '@/models/userModel';
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

const SESSION_COOKIE = 'chatbot_session';

async function botRequiresAuth(chatBotId: string): Promise<boolean> {
  const loadOpenId = async (id: string) => {
    try {
      const mod: any = await import(`@/configuration/${id}/webapp`);
      return mod?.openid;
    } catch {
      return undefined;
    }
  };
  const openid = (await loadOpenId(chatBotId)) ?? (await loadOpenId('default'));
  return !!(openid?.authorization_endpoint && openid?.client_id);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    question,
    history,
    enablegptfallback,
    session,
    reqQuery,
    chainStatus = false,
    conversation_id,
  } = req.body;
  const { pinecone_name_space } = req.query;
  const chatBotId = String(pinecone_name_space || 'default');

  await dbConnect();

  //only accept post requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Enforce authentication for bots that have OpenID configured.
  if ((await botRequiresAuth(chatBotId)) && !req.cookies[SESSION_COOKIE]) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question;
  // const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    //create chain
    const chain = new makeChain(chatBotId);
    if (chainStatus) {
      const response = await chain.run(question);
      return res.status(200).json(response);
    }

    // we have to upsert a new user only if there is no conversation_id in the localstorage;
    let user: IUser;
    if (!conversation_id) {
      user = await upsertUser(chatBotId, session);
    } else {
      user = (await UserModel.findById(conversation_id)) as IUser;
    }

    const sessionToken = req.cookies[SESSION_COOKIE];
    const headers = {
      ...req.headers,
      ...(sessionToken ? { authorization: `Bearer ${sessionToken}` } : {}),
    };

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
                reqQuery,
                reqBody: req.body,
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
            const status = error?.status === 401 ? 401 : 500;
            res
              .status(status)
              .json({ error: error?.message || 'Something went wrong' });
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
                reqQuery,
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
