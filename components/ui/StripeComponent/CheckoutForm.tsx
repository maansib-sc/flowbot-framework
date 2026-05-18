import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import Button from '../Buttons/Button';

const CheckoutForm = ({ onClose }: { onClose: (value: string) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [showButton, setShowButton] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    setShowButton(false);

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000',
      },
      redirect: 'if_required',
    });

    const getpaymentDetails = async (id: any) => {
      try {
        let res = await fetch('/api/payment-method', {
          method: 'POST',
          body: JSON.stringify({
            paymentMethodId: id,
          }),
        });
        res = await res.json();
        return res;
      } catch (error) {
        return error;
      }
    };

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      // console.log(" error ====>",result.error.message);
      onClose(JSON.stringify({error: true, message: result.error.message}))
    } else if (
      result.paymentIntent &&
      result.paymentIntent.status === 'succeeded'
    ) {
      let paymentdetail = await getpaymentDetails(
        result.paymentIntent.payment_method,
      );
      let response = { ...result, paymentDetail: paymentdetail };
      onClose(JSON.stringify({error: false, message: response}));
    } else {
      let paymentdetail = await getpaymentDetails(
        result.paymentIntent.payment_method, 
      );
      let response = { ...result, paymentDetail: paymentdetail };
      onClose(JSON.stringify({error: false, message: response}));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {showButton && (
        <div className="mt-4">
          <Button disabled={!stripe}>Submit</Button>
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
