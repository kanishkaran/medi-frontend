import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chat, cart } from '../lib/api'; // Import cart API
import { useAuthStore } from '../store/authStore';
import { useMedicineStore } from '../store/medicineStore'; // Import medicineStore
import Button from '../components/Button';
import Input from '../components/Input';
import ReactMarkdown from 'react-markdown';
import {
  MessageSquare,
  Search,
  CircleUser,
  LogOut,
  Send,
  ShoppingCart,
  X,
  Eye,
} from 'lucide-react';
import MedicineDetailsCard from '../components/MedicineDetailsCard'; // Import MedicineDetailsCard component
import type { ChatMessage } from '../types';

export default function Chat() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { medicines, addMedicine, removeMedicine } = useMedicineStore(); // Access medicineStore
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await chat.sendMessage(message.trim());
      console.log('Backend response:', response);

      if (response) {
        if (response.intent === 'search_medicine' && response.medicine_details) {
          // Ensure medicine_details is treated as an array
          const medicines = Array.isArray(response.medicine_details)
            ? response.medicine_details
            : [response.medicine_details];

          medicines.forEach((medicine: any) => {
            addMedicine(medicine); // Add each medicine to the store
          });
          setIsSidebarVisible(true); // Open the sidebar
        }

        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          content: formatResponse(response),
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('Invalid response format from backend');
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);

      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login'); // Redirect to login page
      } else {
        alert('Failed to send your message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (response: any): string => {
    if (response.response) {
      return response.response; // Default response
    }
    return 'I didn’t understand that. Could you rephrase?';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddToCart = async (medicineId: string) => {
    try {
      await cart.add(medicineId, 1); // Use the cart.add function from api.ts
      alert('Added medicine to cart!');
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'An error occurred while adding to the cart.');
    }
  };

  const handleRemoveMedicine = (medicineId: string) => {
    removeMedicine(medicineId); // Remove medicine from the store
  };

  const handleViewCart = () => {
    navigate('/cart'); // Navigate to the cart page
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev); // Toggle sidebar visibility
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-secondary/20 flex flex-col">
        <div className="p-4 border-b border-secondary/20">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">MediVerse</h1>
          </div>
        </div>

        <div className="flex-1"></div> {/* Push Sign Out button to the bottom */}

        <div className="p-4 border-t border-secondary/20">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="h-16 border-b border-secondary/20 flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold">Chat</h2>
          <div className="flex items-center space-x-4">
            <button
              className="p-2 hover:bg-secondary/10 rounded-lg"
              onClick={handleViewCart}
            >
              <ShoppingCart className="h-5 w-5 text-primary" />
            </button>
            <button
              className="p-2 hover:bg-secondary/10 rounded-lg"
              onClick={toggleSidebar} // Toggle sidebar visibility
            >
              <Eye className="h-5 w-5 text-primary" />
            </button>
            <button
              className="p-2 hover:bg-secondary/10 rounded-lg"
              onClick={() => navigate('/user')} // Navigate to the Settings page
            >
              <CircleUser className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-secondary/10'
                }`}
              >
                {msg.sender === 'bot' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-secondary/20">
          <div className="max-w-4xl mx-auto flex space-x-4">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              isLoading={loading}
              disabled={!message.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Medicine Details Sidebar */}
        <div
          className={`absolute top-0 right-0 w-80 h-full bg-gray-50 shadow-lg border-l border-secondary/20 p-6 transition-opacity duration-300 ${
            isSidebarVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary">Medicine Details</h3>
            <button
              className="p-1 rounded-full hover:bg-secondary/10 transition-colors"
              onClick={toggleSidebar} // Close the sidebar
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {medicines.length > 0 ? (
              medicines.map((medicine) => (
                <div key={medicine.id} className="mb-4">
                  <MedicineDetailsCard
                    medicineDetails={medicine}
                    onAddToCart={() => handleAddToCart(medicine.id)}
                  />
                  <button
                    className="mt-2 text-sm text-red-500 hover:underline"
                    onClick={() => handleRemoveMedicine(medicine.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No medicine details available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}