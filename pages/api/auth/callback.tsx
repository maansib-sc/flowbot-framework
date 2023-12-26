import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        const {code} = req.query;
        
        const tokenEndpoint = 'https://oauth2.googleapis.com/token';


        const requestData = {
            code: code,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.NEXT_PUBLIC_NEXTAUTH_CALLBACK_URL,
            grant_type: 'authorization_code',
        };
        const response = await axios.post(tokenEndpoint, null, { params: requestData });
        
        return res.redirect(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/google?code=${response.data.access_token}&token=${response.data.id_token}`);
        
    } catch (error: any) {
        console.log("authentication Error ==>", error)
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }

}