import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://medi-backend-dgf7.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization header
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth-related API calls
export const auth = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
    date_of_birth: string;
    phone_number: string;
  }) => {
    const response = await api.post('/register', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/login', data);
    return response.data;
  },
  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
};

// Chat-related API calls
export const chat = {
  sendMessage: async (message: string) => {
    if (typeof message !== 'string' || message.trim() === '') {
      throw new Error('Message must be a non-empty string');
    }
    console.log('Sending message:', { message: message.trim() });  // Debugging log
    const response = await api.post('/chat', { message: message.trim() }, { headers: { "Content-Type": "application/json" } });
    return response.data;
  },
  recognizeHandwriting: async (formData: FormData) => {
    const response = await api.post('/recognize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Orders-related API calls
export const orders = {
  getHistory: async () => {
    const response = await api.get('/order/history');
    return response.data;
  },
  cancel: async (orderId: string) => {
    const response = await api.post('/order/cancel', { order_id: orderId });
    return response.data;
  },
};

// Cart-related API calls
export const cart = {
  add: async (medicineId: string, quantity: number) => {
    const response = await api.post('/cart', { medicine_id: medicineId, quantity });
    return response.data;
  },
  get: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/cart/${id}`);
    if (!response.status.toString().startsWith("2")) {
      throw new Error("Failed to delete cart item");
    }
    return response.data;
  },
  checkout: async () => {
    const response = await api.post('/checkout');
    return response.data;
  },
  paymentOrder: async (data: { amount: number }) => {
    const response = await api.post('/payment/intent', data);
    return response.data;
  },
  verifyPayment: async (data: { payment_intent_id: string }) => {
    const response = await api.post('/payment/verify', data);
    return response.data;
  },
};

export default api;
