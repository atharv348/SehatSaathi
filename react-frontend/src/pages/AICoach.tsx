import { MessageCircle, Send, Sparkles, HelpCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import api from '../services/api';

function AICoach() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Namaste! 🙏 I\'m AROMI, your AI health companion. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const response = await api.post('/api/chat', { message: input });
      
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response.data.response || 'I\'m here to help! Please tell me more about your health concerns.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting to the backend. Please ensure the API server is running on port 5000.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setTyping(false);
    }
  };

  const quickQuestions = [
    'What should I eat for muscle gain?',
    'Best exercises for beginners?',
    'How to improve sleep quality?',
    'Tips for stress management?'
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 h-[calc(100vh-4rem)]">
      <header className="mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <Sparkles className="text-blue-600" size={36} />
          AI Health Coach AROMI
        </h1>
        <p className="text-blue-700 text-lg">Your 24/7 AI-powered health companion</p>
      </header>

      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 flex flex-col h-[calc(100%-8rem)]">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 border-2 border-gray-300'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-blue-600" />
                    <span className="text-xs font-bold text-blue-600">AROMI</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.content}</p>
                {msg.timestamp && (
                  <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-cyan-100' : 'text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-2xl border-2 border-gray-300">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-600 animate-pulse" />
                  <span className="text-xs font-bold text-blue-600">AROMI is typing</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <HelpCircle size={16} />
              Quick Questions:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="text-left text-sm p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t-2 border-blue-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask AROMI anything about your health..."
              className="flex-1 p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AICoach;
