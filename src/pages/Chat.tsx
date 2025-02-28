import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chat } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import Input from '../components/Input';
import {
  MessageSquare,
  Search,
  Settings,
  LogOut,
  Send,
  ChevronRight,
  Clock,
} from 'lucide-react';
import type { ChatMessage, Conversation } from '../types';

export default function Chat() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    console.log('Message being sent:', message.trim() );

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
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        content: response.message,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground/70 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Recent Conversations
            </h2>
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className="w-full text-left p-2 rounded-lg hover:bg-secondary/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{conv.title}</span>
                  <ChevronRight className="h-4 w-4 text-foreground/50" />
                </div>
                <p className="text-sm text-foreground/50 truncate">
                  {conv.lastMessage}
                </p>
              </button>
            ))}
          </div>
        </div>

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
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-secondary/20 flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold">Chat</h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-secondary/10 rounded-lg">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-secondary/10 rounded-lg">
              <Settings className="h-5 w-5" />
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
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-secondary/20">
          <div className="max-w-4xl mx-auto flex space-x-4">
            <Input
              value={message}
              onChange={(e) => {
                console.log('Input value:', e.target.value);
                setMessage(e.target.value);
              }}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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
      </div>
    </div>
  );
}
