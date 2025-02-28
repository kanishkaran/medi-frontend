import React, { useEffect, useState } from 'react';
import { orders } from '../lib/api';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import type { Order } from '../types';
import { formatPrice } from '../lib/utils';

export default function OrderHistory() {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await orders.getHistory();
        setOrderList(response);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'processing':
        return 'text-yellow-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <Clock className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Order History</h1>
        </div>

        <div className="space-y-4">
          {orderList.map((order) => (
            <div
              key={order.id}
              className="bg-secondary/10 rounded-lg overflow-hidden"
            >
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-foreground/70">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="font-medium">
                    {formatPrice(order.total)}
                  </span>
                  {expandedOrders.has(order.id) ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </button>

              {expandedOrders.has(order.id) && (
                <div className="p-4 border-t border-secondary/20">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-foreground/70">
                        <th className="pb-2">Item</th>
                        <th className="pb-2">Quantity</th>
                        <th className="pb-2 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2">{item.name}</td>
                          <td className="py-2">{item.quantity}</td>
                          <td className="py-2 text-right">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        {orderList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/70">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}