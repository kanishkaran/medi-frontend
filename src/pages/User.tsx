import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, orders } from '../lib/api'; // Import APIs
import Button from '../components/Button';
import { ArrowLeft, Package } from 'lucide-react'; // Import only necessary icons
import type { User, Order } from '../types';

export default function User() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<User | null>(null); // State for user details
  const [orderHistory, setOrderHistory] = useState<Order[]>([]); // State for order history
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await auth.getUser(); // Fetch user details
        setUserDetails(userResponse);

        const orderResponse = await orders.getHistory(); // Fetch order history
        setOrderHistory(orderResponse);
      } catch (error) {
        console.error('Failed to fetch user details or order history:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)} // Navigate back to the previous page
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="space-y-8">
          {/* User Details */}
          {userDetails && (
            <div className="bg-secondary/10 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">User Details</h2>
              <p className="text-sm">
                <span className="font-medium">Username:</span> {userDetails.username}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {userDetails.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Phone:</span> {userDetails.phoneNumber}
              </p>
              <p className="text-sm">
                <span className="font-medium">Date of Birth:</span> {userDetails.dateOfBirth}
              </p>
            </div>
          )}

          {/* Order History */}
          {orderHistory.length > 0 ? (
            <div className="bg-secondary/10 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order History
              </h2>
              <ul className="space-y-4">
                {orderHistory.map((order) => (
                  <li key={order.id} className="border-b border-secondary/20 pb-4">
                    <p className="text-sm">
                      <span className="font-medium">Order ID:</span> {order.id}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Total:</span> ₹{order.total}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span> {order.status}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-secondary/10 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order History
              </h2>
              <p className="text-sm text-foreground/70">No orders found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}