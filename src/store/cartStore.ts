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
      console.log("Fetched cart items from backend:", response); // Debugging log
  
      // Map backend response to match frontend structure
      const mappedItems = response.map((item: any) => ({
        id: item.medicine_id, // Map medicine_id to id
        name: item.medicine_name,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image_url,
      }));
  
      console.log("Mapped cart items:", mappedItems); // Debugging log
      set({ items: mappedItems });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
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
    removeItem: async (id: string) => {
      try {
        // Call the backend API to delete the item
        await cart.delete(id);
        console.log(`Deleted item with id: ${id} from the backend`);
  
        // Update the local state to remove the item
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      } catch (error) {
        console.error(`Failed to delete item with id: ${id}`, error);
      }
    },
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ items: [] }),
}));