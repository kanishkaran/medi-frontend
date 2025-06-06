import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import Button from '../components/Button';
import { CreditCard, Package } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { useState } from 'react';

export default function Checkout() {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card'); // Default to card

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleProceedToPayment = () => {
    navigate('/payment', { state: { paymentMethod: selectedPaymentMethod } }); // Pass payment method to Payment page
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <CreditCard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-secondary/10 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Summary
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-foreground/70">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-secondary/20">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-secondary/10 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <p className="text-foreground/70 mb-4">
                Select a payment method to continue
              </p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={selectedPaymentMethod === 'card'}
                    onChange={() => setSelectedPaymentMethod('card')}
                    className="form-radio text-primary"
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="google_pay"
                    checked={selectedPaymentMethod === 'google_pay'}
                    onChange={() => setSelectedPaymentMethod('google_pay')}
                    className="form-radio text-primary"
                  />
                  <span>Google Pay</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="apple_pay"
                    checked={selectedPaymentMethod === 'apple_pay'}
                    onChange={() => setSelectedPaymentMethod('apple_pay')}
                    className="form-radio text-primary"
                  />
                  <span>Apple Pay</span>
                </label>
              </div>
              <Button
                className="w-full mt-4"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}