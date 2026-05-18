import type { NextApiRequest, NextApiResponse } from 'next';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    try {
        const {paymentMethodId} = JSON.parse(req.body);
        const paymentMethod = await stripe.paymentMethods.retrieve(
            paymentMethodId
        );
        return res.status(200).json({ data: paymentMethod });

    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
}
