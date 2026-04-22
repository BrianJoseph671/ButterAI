import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Message } from '../types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hi! I am the Butter AI assistant. Ask me about how Alex helps HVAC teams respond faster and book more jobs.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize the AI chat session
  useEffect(() => {
    if (!process.env.API_KEY) {
      console.error("API_KEY is not set.");
      // You could also show an error message to the user here
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, my connection is not configured correctly.' }]);
      return;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a helpful and friendly chatbot for Butter AI, an AI voice agent for HVAC contractors. Focus on speed-to-lead, inbound callbacks in seconds, lead qualification, appointment booking, outbound maintenance campaigns, and after-hours coverage. Keep answers concise, practical, and contractor-friendly.',
      },
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        throw new Error("Chat session not initialized.");
      }
      const response = await chatRef.current.sendMessage({ message: input });
      const aiMessage: Message = { sender: 'ai', text: response.text };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: Message = { sender: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-butter-DEFAULT text-gray-900 rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-butter-dark focus:outline-none focus:ring-2 focus:ring-butter-dark focus:ring-opacity-50 transition-transform transform hover:scale-110"
        aria-label="Toggle Chatbot"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-out">
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="font-bold text-lg">Butter AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">&times;</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-4 py-2 max-w-xs ${msg.sender === 'user' ? 'bg-butter-DEFAULT text-gray-900' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                 <div className="rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
                    <span className="animate-pulse">...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t p-4 bg-white rounded-b-xl">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-butter-dark focus:border-butter-dark"
                disabled={isLoading}
              />
              <button type="submit" className="bg-gray-900 text-white rounded-full p-3 hover:bg-gray-800 disabled:bg-gray-400" disabled={isLoading}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;