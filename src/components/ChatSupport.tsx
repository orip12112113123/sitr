'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  userName: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const user = localStorage.getItem('user');
      const userData = user ? JSON.parse(user) : null;
      const userId = userData?.id;

      const response = await fetch(`/api/chat${userId ? `?userId=${userId}` : ''}`);
      const data = await response.json();

      if (data.messages) {
        const previousCount = messages.length;
        setMessages(data.messages);

        // Calculate unread messages (new admin messages)
        if (!isOpen && data.messages.length > previousCount) {
          const newAdminMessages = data.messages.filter(
            (msg: ChatMessage) => msg.isAdmin && !messages.some(m => m.id === msg.id)
          );
          setUnreadCount(prev => prev + newAdminMessages.length);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setLoading(true);

    try {
      const user = localStorage.getItem('user');
      const userData = user ? JSON.parse(user) : null;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.id,
          userName: userData?.name || 'Guest',
          message: newMessage,
          isAdmin: false,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Chat bubble button
  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 bg-pink-600 text-white rounded-full p-4 shadow-lg hover:bg-pink-700 transition-all hover:scale-110 z-40"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  // Chat window
  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl z-40 transition-all ${
        isMinimized ? 'w-80 h-14' : 'w-96 h-[500px]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-peach-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">Chat Support</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleMinimize}
            className="hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleClose}
            className="hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[360px] overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No messages yet.</p>
                <p className="text-sm mt-1">Start a conversation with our support team!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.isAdmin
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-pink-600 text-white'
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1">
                      {msg.isAdmin ? 'Support Team' : msg.userName}
                    </p>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="bg-pink-600 text-white p-2 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
