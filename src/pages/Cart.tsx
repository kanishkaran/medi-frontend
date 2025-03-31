import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
  const navigate = useNavigate();
  const { items, fetchCart, removeItem, updateQuantity } = useCartStore();

  // Fetch cart items when the component is mounted
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate('/checkout'); // Navigate to the checkout page
  };

  const handleContinueShopping = () => {
    navigate('/chat'); // Navigate back to the chat page
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>

        {items.length > 0 ? (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-secondary/10 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-foreground/70">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Total Price for Item */}
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    {/* Remove Item */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-error" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Total and Checkout */}
            <div className="bg-secondary/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold">{formatPrice(total)}</span>
              </div>
              <Button className="w-full" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        ) : (
          // Empty Cart Message
          <div className="text-center py-12">
            <p className="text-foreground/70 mb-4">Your cart is empty</p>
            <Button onClick={handleContinueShopping}>Continue Shopping</Button>
          </div>
        )}
      </div>
    </div>
  );
}