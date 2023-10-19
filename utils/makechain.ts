import axios from 'axios';

const textSimilarityBackendConnectorHost = process.env.NEXT_PUBLIC_BACKEND_TEXT_SIMILARITY

export class makeChain {
  chat_id: string;


  constructor(chat_id: string) {
    this.chat_id = chat_id
  }
  run = async (inputQuestion: string, backendUrl: string = `${textSimilarityBackendConnectorHost}/generate/answer`) => {
    let queryParams = {
      'user_input': inputQuestion,
      'chat_id': this.chat_id
    };
    const options = {
      method: 'POST',
      url: backendUrl,
      params: queryParams,
      headers: {
        'content-type': 'application/json',
      },
    };
    try {
      let documentSearchAPIResp = await axios.request(options);
      let kbResponse = { "text": documentSearchAPIResp.data, "src": "talkingDb" };
      return kbResponse;

    } catch (error) {
      return { "text": "Please try again later", "src": "talkingDb" };
    }

  }
};
