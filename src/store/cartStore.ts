import { create } from 'zustand';
import type { CartItem } from '../types';
import { cart } from '../lib/api'; // Import the cart API

interface CartState {
  items: CartItem[];
  fetchCart: () => Promise<void>;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  fetchCart: async () => {
    try {
      const response = await cart.get(); // Fetch cart items from the backend
      set({ items: response });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  },
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ items: [] }),
}));