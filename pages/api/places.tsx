import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { input } = req.query;

    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=AIzaSyCGwYSglScNK3aiFgnjnqPhPSGRBcc3GhQ`,
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                return res.status(200).json({ msg: response.data });
            })
            .catch((error) => {
                console.log(error);
            });

    } catch (error: any) {
        console.log('error', error);
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
}
