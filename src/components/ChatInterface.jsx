import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generateGeminiResponse } from '../services/GeminiService';

/**
 * @typedef {Object} ChatMessage
 * @property {string} id - Unique message identifier
 * @property {'user'|'ai'} role - The sender of the message
 * @property {string} content - The text content of the message
 */

/**
 * Renders an accessible chat interface to interact with the Gemini AI.
 * Uses React.memo to prevent unnecessary re-renders from parent components.
 * 
 * @returns {JSX.Element} The rendered ChatInterface component
 */
const ChatInterface = React.memo(() => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  /**
   * Scrolls the chat view to the most recent message.
   * Wrapped in useCallback to maintain a stable reference.
   * 
   * @returns {void}
   */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /**
   * Handles the submission of a new user message.
   * Prevents empty submissions, updates state, and fetches the AI response.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event
   * @returns {Promise<void>}
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError('');

    try {
      const responseText = await generateGeminiResponse(userMessage.content);
      const aiMessage = { id: (Date.now() + 1).toString(), role: 'ai', content: responseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the response.');
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading]);

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-white rounded-md shadow-md border border-slate-200 overflow-hidden my-8">
      {/* Chat Header */}
      <div className="bg-[#0b2b5e] text-white px-6 py-4 border-b-4 border-[#c02a2a] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Election Assistant AI</h2>
          <p className="text-sm text-blue-200">Ask questions about voting, registration, or your rights.</p>
        </div>
        <a 
          href="https://voters.eci.gov.in/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md border border-white/30 transition-colors flex items-center gap-2 font-semibold"
          aria-label="Verify information on the official Election Commission of India portal (opens in new tab)"
        >
          <span>Verify with ECI Portal</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </div>

      {/* Chat History Area */}
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50"
        aria-live="polite"
        aria-atomic="false"
        role="log"
      >
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">
            <p>No messages yet. Start a conversation below!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#0b2b5e] text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <span className="sr-only">
                  {msg.role === 'user' ? 'You said: ' : 'Assistant said: '}
                </span>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start" aria-live="polite">
            <div className="bg-white border border-slate-200 text-slate-500 rounded-lg p-4 rounded-bl-none shadow-sm flex items-center gap-2">
              <span className="sr-only">Assistant is typing...</span>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center" aria-live="assertive">
            <span className="inline-block bg-red-50 text-[#c02a2a] border border-red-200 px-4 py-2 rounded-md text-sm font-medium">
              {error}
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <label htmlFor="chat-input" className="sr-only">Type your question here</label>
          <input
            id="chat-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder="E.g., How do I register to vote?"
            className="flex-1 border border-slate-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0b2b5e] focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400 text-slate-800"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-[#c02a2a] hover:bg-[#a02222] text-white font-bold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;
