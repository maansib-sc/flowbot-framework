import type { NextApiRequest, NextApiResponse } from 'next';
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    try {
        const {amount, currency, description} = JSON.parse(req.body);
        const paymentIntent = await stripe.paymentIntents.create({
            currency: currency,
            amount: amount,
            description: description,
            // shipping: {
            //     name: 'Jenny Rosen',
            //     address: {
            //       line1: '510 Townsend St',
            //       postal_code: '98140',
            //       city: 'San Francisco',
            //       state: 'CA',
            //       country: 'US',
            //     },
            //   },
            payment_method_types: ['card', 'us_bank_account'],
          });
        return res.status(200).json({ clientSecret: paymentIntent.client_secret });

    } catch (error: any) {
        console.log('error', error);
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
}
