import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { cart } from '../lib/api';
import Button from '../components/Button';
import { CreditCard } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51R8nH7CY9tdh1bLPCDPebCtB27QVkMydKctZPzi4jNEmdnRIV9kcFrPshnxrXVkv56Dz1ouynNGilAX8Hzu8gVHE00nQG3rhWb');

function CheckoutForm({ total, paymentMethod }: { total: number; paymentMethod: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create Payment Intent from backend
      const response = await cart.paymentOrder({ amount: total });
      const { client_secret, payment_intent_id } = response;

      if (!client_secret || !payment_intent_id) {
        throw new Error('Failed to retrieve client_secret or payment_intent_id from backend.');
      }

      // Step 2: Confirm Payment with Stripe
      if (paymentMethod === 'card') {
        const cardElement = elements?.getElement(CardElement);
        if (!cardElement) {
          throw new Error('CardElement not found. Ensure it is mounted correctly.');
        }

        const result = await stripe?.confirmCardPayment(client_secret, {
          payment_method: {
            card: cardElement,
          },
        });

        if (result?.error) {
          console.error('Payment failed:', result.error);
          alert(`Payment failed: ${result.error.message}`);
          return;
        } else if (result?.paymentIntent?.status === 'succeeded') {
          // Step 3: Verify Payment and Complete Order
          const verifyResponse = await cart.verifyPayment({ payment_intent_id });
          alert(verifyResponse.message);
          clearCart();
          navigate('/order/history');
        } else {
          console.error('Unexpected payment status:', result?.paymentIntent?.status);
          alert('Unexpected error occurred. Please try again.');
        }
      } else if (paymentMethod === 'google_pay' || paymentMethod === 'apple_pay') {
        alert(`${paymentMethod} is not yet implemented.`);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {paymentMethod === 'card' && <CardElement className="p-4 border rounded-lg" />}
      <Button type="submit" isLoading={loading} disabled={!stripe || !elements}>
        Pay {formatPrice(total)}
      </Button>
    </form>
  );
}

function PaymentRequestForm({ total }: { total: number }) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<null | any>(null);

  useEffect(() => {
    if (stripe) {
      const totalInSubunits = Math.round(total * 100); // Convert to paise (smallest unit)
      const pr = stripe.paymentRequest({
        country: 'IN',
        currency: 'inr',
        total: {
          label: 'Total',
          amount: totalInSubunits, // Use integer value
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment()
        .then((result) => {
          if (result) {
            setPaymentRequest(pr);
          }
        })
        .catch((error) => {
          console.error('Error checking payment method availability:', error);
        });
    }
  }, [stripe, total]);

  if (!paymentRequest) {
    return <p className="text-sm text-gray-500">Google Pay or Apple Pay is not available.</p>;
  }

  // Handle payment method submission
  paymentRequest.on('paymentmethod', async (event: any) => {
    try {
      // Step 1: Create Payment Intent from backend
      const response = await cart.paymentOrder({ amount: total });
      const { client_secret, payment_intent_id } = response;

      if (!client_secret || !payment_intent_id) {
        throw new Error('Failed to retrieve client_secret or payment_intent_id from backend.');
      }

      // Step 2: Confirm Payment with Stripe
      const { error } = await stripe?.confirmCardPayment(client_secret, {
        payment_method: event.paymentMethod.id,
      });

      if (error) {
        console.error('Payment failed:', error);
        event.complete('fail');
        alert(`Payment failed: ${error.message}`);
        return;
      }

      // Step 3: Complete the payment
      event.complete('success');
      alert('Payment successful!');
    } catch (error) {
      console.error('Payment failed:', error);
      event.complete('fail');
      alert('Payment failed. Please try again.');
    }
  });

  return (
    <PaymentRequestButtonElement
      options={{ paymentRequest }}
      className="w-full mb-4"
    />
  );
}

export default function Payment() {
  const { items } = useCartStore();
  const location = useLocation();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Retrieve the selected payment method from the location state
  const paymentMethod = location.state?.paymentMethod || 'card'; // Default to card

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <CreditCard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Payment</h1>
        </div>

        <div className="bg-secondary/10 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Order Total</h2>
            <p className="text-3xl font-bold">{formatPrice(total)}</p>
          </div>

          <Elements stripe={stripePromise}>
            {paymentMethod === 'google_pay' || paymentMethod === 'apple_pay' ? (
              <PaymentRequestForm total={total} />
            ) : (
              <CheckoutForm total={total} paymentMethod={paymentMethod} />
            )}
          </Elements>
        </div>
      </div>
    </div>
  );
}