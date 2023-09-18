import axios from 'axios';

export class makeChain {
  chat_id: string;

  constructor(chat_id: string) {
    this.chat_id = chat_id
  }
  run = async (inputQuestion: string) => {
    const documentSearchAPI = "http://api-server:80/generate/answer";
    let queryParams = {
      'question': inputQuestion,
      'chat_id':this.chat_id
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
    let kbResponse = {"text": documentSearchAPIResp.data, "src": "talkingDb"};
    return kbResponse;
  }
};
