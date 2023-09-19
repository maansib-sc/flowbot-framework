import axios from 'axios';

export class makeChain {
  chat_id: string;


  constructor(chat_id: string) {
    this.chat_id = chat_id
  }
  run = async (inputQuestion: string, enablegptfallback: Number) => {
    const documentSearchAPI = "http://stage-document-backend.smarter.codes:8084/generate/answer";
    let queryParams = {
      'question': inputQuestion,
      'chat_id': this.chat_id,
      'enable_gpt_fallback': enablegptfallback
    };
    const options = {
      method: 'POST',
      url: documentSearchAPI,
      params: queryParams,
      headers: {
        'content-type': 'application/json',
      },
    };

    let documentSearchAPIResp = await axios.request(options);
    let kbResponse = { "text": documentSearchAPIResp.data, "src": "talkingDb" };
    return kbResponse;
  }
};
