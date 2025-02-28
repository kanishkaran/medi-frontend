import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { cart } from '../lib/api';
import Button from '../components/Button';
import Input from '../components/Input';
import { CreditCard } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function Payment() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await cart.checkout({ paymentDetails: {} });
      clearCart();
      navigate('/order/history');
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

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

          <form onSubmit={handlePayment} className="space-y-6">
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                required
              />
              <Input
                label="CVC"
                placeholder="123"
                required
              />
            </div>
            <Input
              label="Cardholder Name"
              placeholder="John Doe"
              required
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
            >
              Pay {formatPrice(total)}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}