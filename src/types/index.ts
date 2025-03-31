export interface User {
  id: string;
  username: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

export interface CartItem {
  id: string; // Unique identifier for the cart item
  name: string; // Name of the medicine
  quantity: number; // Quantity of the item in the cart
  price: number; // Price per unit
  image_url: string; // URL of the item's image
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}