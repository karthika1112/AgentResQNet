import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Camera, MapPin, HeartPulse, ShieldAlert, Navigation, Home, Activity } from 'lucide-react';
import { MessageBubble } from '../../components/AIChat/MessageBubble';
import { ThinkingAnimation } from '../../components/AIChat/ThinkingAnimation';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const VictimAICompanion = () => {
  const [messages, setMessages] = useState([
    { id: 'welcome', text: "Hello. I am the ResQNet AI Emergency Assistant. If you are in immediate life-threatening danger, please use the SOS button. How can I assist you right now?", isAI: true, timestamp: new Date(), agent: "Commander Agent" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeAgent, setActiveAgent] = useState("Commander Agent");
  const [pendingAudioUrl, setPendingAudioUrl] = useState(null);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
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
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim() && !pendingAudioUrl) return;

    setInputValue('');
    const audioToSend = pendingAudioUrl;
    setPendingAudioUrl(null);
    
    setMessages(prev => [...prev, { id: `usr_${Date.now()}`, text: textToSend || '🎤 Voice Message', audioUrl: audioToSend, isAI: false, timestamp: new Date() }]);
    setIsTyping(true);

    try {
      let aiResponse = '';
      try {
        const res = await api.post('/commander/chat', { message: textToSend });
        aiResponse = res.data.data.response || res.data.data;
      } catch (err) {
        aiResponse = `[Simulated Response] I have received your request regarding "${textToSend}". I am coordinating with the Rescue and Evacuation agents to assist you. Stay calm.`;
      }

      // Determine attribution based on payload (Hackathon Mock Mode Parsing)
      let respondingAgent = "Commander Agent";
      if (typeof aiResponse === 'string') {
        if (aiResponse.includes('EvacuationAgent')) respondingAgent = "Evacuation Agent";
        else if (aiResponse.includes('RescueAgent')) respondingAgent = "Rescue Agent";
        else if (aiResponse.includes('ResourceAgent')) respondingAgent = "Resource Agent";
        else if (aiResponse.includes('DisasterIntelligenceAgent')) respondingAgent = "Disaster Intelligence Agent";
        else if (aiResponse.includes('VerificationAgent')) respondingAgent = "Incident Verification Agent";
      }

      setActiveAgent(respondingAgent);

      const formatResponse = (text) => {
        if (typeof text !== 'string') return text;
        return text.replace(/({[\s\S]*?})/g, (match) => {
          try {
            const parsed = JSON.parse(match);
            return '\n```json\n' + JSON.stringify(parsed, null, 2) + '\n```\n';
          } catch (e) {
            return match; 
          }
        });
      };

      const formattedText = typeof aiResponse === 'string' ? formatResponse(aiResponse) : '```json\n' + JSON.stringify(aiResponse, null, 2) + '\n```';

      setMessages(prev => [...prev, { 
        id: `ai_${Date.now()}`, 
        text: formattedText, 
        isAI: true, 
        timestamp: new Date(),
        isTyping: true,
        agent: respondingAgent
      }]);
    } catch (error) {
      toast.error('Failed to communicate with AI Assistant');
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListen = async () => {
    if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setPendingAudioUrl(audioUrl);
          
          // Stop stream tracks to free microphone
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        recognitionRef.current?.start();
        setIsListening(true);
        toast.success("Recording started...", { icon: '🎙️' });
      } catch (err) {
        toast.error("Microphone access denied. Please allow permissions.");
        console.error("Mic access error", err);
      }
    }
  };

  const quickActions = [
    { label: "Nearest Shelter", icon: Home, color: "blue", action: "Where is the nearest evacuation shelter with available beds?" },
    { label: "Medical Help", icon: HeartPulse, color: "red", action: "I need medical assistance immediately. Provide basic first aid guidance." },
    { label: "Safe Route", icon: Navigation, color: "green", action: "Calculate a safe evacuation route away from the disaster zone." },
    { label: "Food & Water", icon: Activity, color: "orange", action: "Where can I get emergency food and water supplies?" }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0B0F19] rounded-2xl border border-[rgba(255,255,255,0.05)] overflow-hidden shadow-2xl relative group">
      
      {/* Decorative Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -top-40 -left-40 mix-blend-screen"></div>
        <div className="absolute w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] bottom-0 right-0 mix-blend-screen"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-4 bg-[#141C2D]/80 backdrop-blur-md border-b border-[rgba(255,255,255,0.05)] shadow-md">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40 z-10 relative shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <span className="text-2xl">🤖</span>
            </div>
            {isTyping && <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75"></div>}
          </div>
          <div>
            <h2 className="text-white font-black tracking-widest uppercase">AI Emergency Assistant</h2>
            <div className="flex items-center mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
              <p className="text-xs text-green-400 font-mono font-bold tracking-wider">ONLINE & LISTENING</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col space-y-4">
        {messages.map((msg, index) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isAI={msg.isAI} 
            isTyping={msg.isTyping && index === messages.length - 1} 
            agentName={msg.agent || "AI Assistant"}
          />
        ))}

        {isTyping && (
          <div className="flex w-full justify-start pl-2">
            <ThinkingAnimation />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions Panel */}
      <div className="relative z-10 px-4 py-3 bg-[#141C2D]/50 backdrop-blur-sm border-t border-[rgba(255,255,255,0.05)]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(action.action)}
                disabled={isTyping}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#0B0F19] hover:bg-${action.color}-500/10 hover:border-${action.color}-500/30 transition-all group disabled:opacity-50`}
              >
                <Icon size={18} className={`text-gray-400 group-hover:text-${action.color}-400 mb-1 transition-colors`} />
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{action.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-4 bg-[#141C2D] border-t border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center bg-[#0B0F19] rounded-xl border border-[rgba(255,255,255,0.1)] p-2 focus-within:border-blue-500/50 transition-colors shadow-inner">
          <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors bg-[rgba(255,255,255,0.02)] rounded-lg mr-2" title="Upload Evidence (Photos/Docs)">
             <Camera size={18} />
          </button>
          
          {pendingAudioUrl ? (
            <div className="flex-1 flex items-center px-2 bg-black/20 rounded mr-2 overflow-hidden border border-[rgba(255,255,255,0.05)]">
              <audio controls src={pendingAudioUrl} className="h-8 w-full outline-none" />
              <button onClick={() => setPendingAudioUrl(null)} className="ml-2 text-red-400 hover:text-red-300 font-bold" title="Discard Audio">
                 ✕
              </button>
            </div>
          ) : (
            <input
              type="text"
              className="flex-1 bg-transparent text-white outline-none text-sm px-2 font-mono"
              placeholder={isListening ? "Listening... (Speak now)" : "Describe your emergency or ask a question..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              readOnly={isListening}
            />
          )}

          <button 
            onClick={toggleListen}
            className={`p-2 rounded-lg mx-2 transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            title="Voice Recording"
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button 
            onClick={() => handleSend()}
            disabled={(!inputValue.trim() && !pendingAudioUrl) || isTyping}
            className={`px-6 py-3 rounded-lg transition-colors font-black uppercase tracking-widest text-xs flex items-center ${(!inputValue.trim() && !pendingAudioUrl) || isTyping ? 'bg-[rgba(255,255,255,0.05)] text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]'}`}
          >
            <Send size={16} className="mr-2" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
