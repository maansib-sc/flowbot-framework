import { Document } from 'langchain/document';

export type Message = {
  type: 'apiMessage' | 'userMessage';
  message: string;
  src: 'test' | 'gpt4' | 'talkingDb' | ''
  isStreaming?: boolean;
  sourceDocs?: Document[];
  step?: { [key: string]: any };
  answer?: string;
  error?: boolean;
  errorMessage?: string
};

export type contextItem = {
  content: Array<string>;
  content_source: string;
};

export type contextItemArray = contextItem[];

export type Page = {
  page_number: string;
  page_body: string
};
