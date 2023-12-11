import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        const {code} = req.query;
        
        const tokenEndpoint = 'https://oauth2.googleapis.com/token';
        const userinfoEndpoint = 'https://www.googleapis.com/oauth2/v3/userinfo';


        const requestData = {
            code: code,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.NEXT_PUBLIC_NEXTAUTH_CALLBACK_URL,
            grant_type: 'authorization_code',
        };
        console.log("requestData ==>", requestData)
        const response = await axios.post(tokenEndpoint, null, { params: requestData });
        // console.log("const ==>", response.data)

        const userInfoResponse = await axios.get(userinfoEndpoint, {
            headers: {
              Authorization: `Bearer ${response.data.access_token}`,
            },
          });
        
          const userEmail = userInfoResponse.data.email;
        
        return res.redirect(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/google?code=${userEmail}`);
        
    } catch (error: any) {
        console.log("authentication Error ==>", error)
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }

}