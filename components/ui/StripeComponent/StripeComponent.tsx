import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import CheckoutForm from './CheckoutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

const StripeComponent = ({
  options,
  onClose,
}: {
  options: { amount: number; currency: string; description: string };
  onClose: (value: string) => void;
}) => {
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    setStripePromise(
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ''),
    );
  }, []);

  useEffect(() => {
    if (options) {
      fetch('/api/payment-intent', {
        method: 'POST',
        body: JSON.stringify({
          amount: options.amount,
          currency: options.currency,
          description: options.description,
        }),
      }).then(async (result) => {
        const { clientSecret } = await result.json();
        setClientSecret(clientSecret);
      });
    }
  }, [options]);

  return (
    <div style={{ width: '520px' }}>
      {clientSecret && stripePromise && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: clientSecret }}
        >
          <CheckoutForm onClose={onClose} />
        </Elements>
      )}
    </div>
  );
};

export default StripeComponent;
