import { Document } from 'langchain/document';

export type Message = {
  type: 'apiMessage' | 'userMessage';
  message: string;
  src: 'test' | 'gpt4' | 'talkingDb' | ''
  isStreaming?: boolean;
  sourceDocs?: Document[];
};

export type Page = {
  page_number: string;
  page_body:string
};
