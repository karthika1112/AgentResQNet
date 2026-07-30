import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, Mic, MicOff, Eraser, Download } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ThinkingAnimation } from './ThinkingAnimation';
import { WorkflowVisualization } from './WorkflowVisualization';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const CommanderChat = () => {
  const [messages, setMessages] = useState([
    { id: 'welcome', text: "Hello. I am the ResQNet Commander AI. State your emergency or request, and I will coordinate our specialist agents.", isAI: true, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Workflow State
  const [workflowId, setWorkflowId] = useState(null);
  const [workflowNodes, setWorkflowNodes] = useState([]);
  const [overallConfidence, setOverallConfidence] = useState(null);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Socket
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    socketRef.current.on('workflow_started', (data) => {
      setWorkflowId(data.workflowId);
      setWorkflowNodes([]);
      setOverallConfidence(null);
    });

    socketRef.current.on('agent_started', (data) => {
      setWorkflowNodes(prev => {
        const existing = prev.findIndex(n => n.agent === data.agentName);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], status: 'Running' };
          return updated;
        }
        return [...prev, { agent: data.agentName, status: 'Running', latency: null }];
      });
    });

    socketRef.current.on('agent_completed', (data) => {
      setWorkflowNodes(prev => {
        const updated = [...prev];
        const existing = updated.findIndex(n => n.agent === data.agentName);
        if (existing >= 0) {
          updated[existing] = { ...updated[existing], status: 'Success', latency: data.latency };
        }
        return updated;
      });
    });
    
    socketRef.current.on('agent_failed', (data) => {
      setWorkflowNodes(prev => {
        const updated = [...prev];
        const existing = updated.findIndex(n => n.agent === data.agentName);
        if (existing >= 0) {
          updated[existing] = { ...updated[existing], status: 'Failed', latency: data.latency };
        }
        return updated;
      });
    });

    socketRef.current.on('workflow_completed', (data) => {
      setOverallConfidence(data.overallConfidence);
    });

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev + ' ' + transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, workflowNodes, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');
    
    // Add user message
    const userMsg = { id: `usr_${Date.now()}`, text: userText, isAI: false, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await api.post('/commander/chat', { message: userText });
      const data = res.data.data;
      
      // Update UI with final data in case socket missed it
      if (data.workflowNodes) setWorkflowNodes(data.workflowNodes);
      if (data.overallConfidence) setOverallConfidence(data.overallConfidence);

      const aiMsg = { 
        id: `ai_${Date.now()}`, 
        text: data.response, 
        isAI: true, 
        timestamp: new Date(),
        isTyping: true // Trigger typewriter effect
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to communicate with Commander Agent');
      setMessages(prev => [...prev, { id: `err_${Date.now()}`, text: "Error communicating with orchestration engine.", isAI: true, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const clearChat = () => {
    setMessages([{ id: 'welcome', text: "Chat history cleared. How can I assist you?", isAI: true, timestamp: new Date() }]);
    setWorkflowNodes([]);
    setWorkflowId(null);
  };

  const exportChat = () => {
    const chatText = messages.map(m => `[${m.timestamp.toLocaleString()}] ${m.isAI ? 'Commander' : 'User'}: ${m.text}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ResQNet_Chat_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0F19] rounded-xl border border-[rgba(255,255,255,0.05)] overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-[#141C2D] border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <span className="text-xl">🧠</span>
          </div>
          <div>
            <h2 className="text-white font-semibold">Commander Agent</h2>
            <p className="text-xs text-gray-400">Multi-Agent Orchestration Engine</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={clearChat} className="p-2 text-gray-400 hover:text-white rounded hover:bg-white/5 transition" title="Clear Chat">
            <Eraser size={16} />
          </button>
          <button onClick={exportChat} className="p-2 text-gray-400 hover:text-white rounded hover:bg-white/5 transition" title="Export Chat">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {messages.map((msg, index) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isAI={msg.isAI} 
            isTyping={msg.isTyping && index === messages.length - 1} // Only type the very last message
          />
        ))}
        
        {/* Render Workflow Panel if active */}
        {workflowNodes.length > 0 && (
          <div className="w-full mb-4 pl-4 pr-12">
            <WorkflowVisualization 
              workflowId={workflowId} 
              nodes={workflowNodes} 
              overallConfidence={overallConfidence} 
            />
          </div>
        )}

        {isTyping && (
          <div className="flex w-full mb-4 justify-start">
            <ThinkingAnimation />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#141C2D] border-t border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center bg-[#0B0F19] rounded-lg border border-[rgba(255,255,255,0.1)] px-3 py-2 focus-within:border-blue-500/50 transition-colors">
          <input
            type="text"
            className="flex-1 bg-transparent text-white outline-none text-sm px-2"
            placeholder="Report an emergency or request resources..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button 
            onClick={toggleListen}
            className={`p-2 rounded-full mx-1 transition-colors ${isListening ? 'bg-red-500/20 text-red-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            title="Push to Talk"
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className={`p-2 rounded-full transition-colors ${!inputValue.trim() || isTyping ? 'text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
          >
            <Send size={18} className={!inputValue.trim() || isTyping ? '' : '-ml-0.5 mt-0.5'} />
          </button>
        </div>
      </div>
    </div>
  );
};
