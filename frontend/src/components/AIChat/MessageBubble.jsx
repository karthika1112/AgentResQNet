import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Volume2 } from 'lucide-react';
import { TypingIndicator } from './TypingIndicator';

export const MessageBubble = ({ message, isAI, isTyping = false, agentName = 'AI Agent' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`flex w-full mb-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className={`relative max-w-[80%] rounded-xl p-4 ${isAI ? 'bg-[#1A2333] text-gray-100 border border-[rgba(255,255,255,0.05)]' : 'bg-blue-600 text-white'}`}>
        
        {isAI && (
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[rgba(255,255,255,0.1)]">
            <span className="text-xs font-semibold text-blue-400 flex items-center tracking-widest uppercase">
              🧠 {agentName}
            </span>
            <div className="flex space-x-2">
              <button onClick={handleSpeak} className="text-gray-400 hover:text-white transition-colors" title="Read Aloud">
                <Volume2 size={14} />
              </button>
              <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors" title="Copy text">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        )}

        <div className="prose prose-invert max-w-none text-sm break-words">
          {message.audioUrl && (
            <div className="mb-2 p-1 bg-black/20 rounded-lg">
              <audio controls src={message.audioUrl} className="w-full h-8 max-w-[250px] outline-none" />
            </div>
          )}
          {isTyping && isAI ? (
            <TypingIndicator text={message.text} speed={15} />
          ) : (
            <ReactMarkdown>{message.text}</ReactMarkdown>
          )}
        </div>
        
        <div className={`text-[10px] mt-2 text-right opacity-50`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
