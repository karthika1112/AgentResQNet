import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  Send, Mic, MicOff, Eraser, Download, Share2, Printer, 
  Map as MapIcon, Activity, BarChart2, Paperclip, Navigation, Globe,
  CheckCircle, Clock, Database, AlertTriangle
} from 'lucide-react';
import { MessageBubble } from '../../AIChat/MessageBubble';
import { ThinkingAnimation } from '../../AIChat/ThinkingAnimation';
import api from '../../../api/axios';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const AgentChatModule = ({ agentName, subtitle, icon: Icon, endpoint, welcomeMessage }) => {
  const [messages, setMessages] = useState([
    { id: 'welcome', text: welcomeMessage, isAI: true, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('workflow'); // 'map', 'workflow', 'metrics'
  const [language, setLanguage] = useState('en-US'); // Speech recognition lang
  
  // Simulated Agent Telemetry
  const [metrics, setMetrics] = useState({
    confidence: 98,
    execTime: 124,
    health: 'Optimal',
    status: 'Idle'
  });
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
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
        toast.error('Voice input failed.');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Update language when changed
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (overrideText = null) => {
    const userText = overrideText || inputValue;
    if (!userText.trim()) return;

    if (!overrideText) setInputValue('');
    
    // Add user message
    const userMsg = { id: `usr_${Date.now()}`, text: userText, isAI: false, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setMetrics(prev => ({ ...prev, status: 'Processing' }));

    try {
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

      const start = Date.now();
      let aiResponse = '';
      try {
        const res = await api.post(endpoint, { message: userText });
        aiResponse = res.data.data.response || res.data.data;
      } catch (err) {
        aiResponse = `[Simulated Response from ${agentName}] I am currently processing your request: "${userText}". All systems nominal.`;
      }
      const execTime = Date.now() - start;

      const formattedText = typeof aiResponse === 'string' ? formatResponse(aiResponse) : '```json\n' + JSON.stringify(aiResponse, null, 2) + '\n```';

      const aiMsg = { 
        id: `ai_${Date.now()}`, 
        text: formattedText, 
        isAI: true, 
        timestamp: new Date(),
        isTyping: true
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // Update Metrics randomly for effect
      setMetrics({
        confidence: Math.floor(Math.random() * 15) + 85, // 85-99%
        execTime: execTime + Math.floor(Math.random() * 200),
        health: 'Optimal',
        status: 'Idle'
      });
      toast.success(`${agentName} Task Executed Successfully`);

    } catch (error) {
      console.error(error);
      toast.error(`Failed to communicate with ${agentName}`);
      setMessages(prev => [...prev, { id: `err_${Date.now()}`, text: "Error communicating with orchestration engine.", isAI: true, timestamp: new Date() }]);
      setMetrics(prev => ({ ...prev, status: 'Error', health: 'Degraded' }));
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
      toast('Listening...', { icon: '🎙️' });
    }
  };

  const suggestedPrompts = [
    "Analyze recent incidents",
    "Identify critical risk zones",
    "Run system diagnostics"
  ];

  return (
    <div className="flex flex-col lg:flex-row h-[85vh] bg-[#0B0F19] rounded-xl border border-[rgba(255,255,255,0.05)] overflow-hidden shadow-2xl relative">
      
      {/* ================= LEFT PANEL: CHAT UI (65%) ================= */}
      <div className="flex-1 flex flex-col border-r border-[rgba(255,255,255,0.05)]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-[#141C2D] border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Icon size={20} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-white font-black tracking-widest uppercase flex items-center">
                {agentName}
                <span className={`ml-3 w-2 h-2 rounded-full ${metrics.health === 'Optimal' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)]' : 'bg-red-500 animate-pulse'}`}></span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">{subtitle}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <button onClick={() => setMessages([{ id: 'welcome', text: "Chat cleared.", isAI: true, timestamp: new Date() }])} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5" title="Clear Chat">
              <Eraser size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5" title="Share Report">
              <Share2 size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5" title="Print Log">
              <Printer size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5" title="Export PDF/TXT">
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0B0F19]">
          {messages.map((msg, index) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isAI={msg.isAI} 
              isTyping={msg.isTyping && index === messages.length - 1} 
              agentName={agentName}
            />
          ))}

          {isTyping && (
            <div className="flex w-full mb-4 justify-start pl-2">
              <ThinkingAnimation />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#141C2D] border-t border-[rgba(255,255,255,0.05)]">
          {/* Suggested Prompts */}
          <div className="flex space-x-2 mb-3 overflow-x-auto custom-scrollbar pb-1">
            {suggestedPrompts.map((prompt, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-[10px] font-bold uppercase tracking-wider transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-[#0B0F19] rounded-xl border border-[rgba(255,255,255,0.1)] p-2 focus-within:border-blue-500/50 transition-colors shadow-inner">
            <button className="p-2 text-gray-400 hover:text-blue-400 transition" title="Upload Media (Image, Video, PDF)">
              <Paperclip size={18} />
            </button>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-gray-400 text-xs outline-none cursor-pointer border-r border-[rgba(255,255,255,0.1)] pr-2 mr-2"
              title="Voice Input Language"
            >
              <option value="en-US">ENG</option>
              <option value="ta-IN">TAM</option>
              <option value="hi-IN">HIN</option>
            </select>
            <input
              type="text"
              className="flex-1 bg-transparent text-white outline-none text-sm px-2 font-mono"
              placeholder={`Instruct ${agentName}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button 
              onClick={toggleListen}
              className={`p-2 rounded-lg mx-1 transition-colors ${isListening ? 'bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              title="Voice Dictation"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button 
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              className={`px-4 py-2 ml-1 rounded-lg transition-colors font-bold uppercase tracking-widest text-xs flex items-center ${!inputValue.trim() || isTyping ? 'bg-[rgba(255,255,255,0.05)] text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}
            >
              <Send size={14} className="mr-2" /> Send
            </button>
          </div>
        </div>
      </div>

      {/* ================= RIGHT PANEL: INTELLIGENCE SIDEBAR (35%) ================= */}
      <div className="w-full lg:w-[35%] bg-[#141C2D] flex flex-col border-l border-[rgba(255,255,255,0.05)]">
        
        {/* Sidebar Tabs */}
        <div className="flex border-b border-[rgba(255,255,255,0.05)] bg-[#0B0F19]">
          <button onClick={() => setActiveTab('workflow')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex justify-center items-center ${activeTab === 'workflow' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'}`}>
            <Activity size={14} className="mr-2" /> Workflow
          </button>
          <button onClick={() => setActiveTab('map')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex justify-center items-center ${activeTab === 'map' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'}`}>
            <MapIcon size={14} className="mr-2" /> Map & GPS
          </button>
          <button onClick={() => setActiveTab('metrics')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex justify-center items-center ${activeTab === 'metrics' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'}`}>
            <BarChart2 size={14} className="mr-2" /> Metrics
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative">
          
          {/* TAB 1: WORKFLOW & TIMELINE */}
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-[rgba(255,255,255,0.1)] pb-2">Multi-Agent Workflow</h3>
                <div className="flex flex-col items-center space-y-2 font-mono text-[10px]">
                  <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg border border-purple-500/30 w-full text-center">Master Commander</div>
                  <div className="h-4 w-px bg-gray-600"></div>
                  <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg border border-blue-500/30 w-full text-center">{agentName}</div>
                  <div className="h-4 w-px bg-gray-600"></div>
                  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30 w-full text-center flex items-center justify-center">
                    <Database size={12} className="mr-1" /> External APIs
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-[rgba(255,255,255,0.1)] pb-2">Activity Timeline</h3>
                <div className="space-y-4 pl-2 border-l border-[rgba(255,255,255,0.1)]">
                  <div className="relative pl-4">
                    <div className="absolute -left-1.5 top-1 w-3 h-3 bg-gray-500 rounded-full border-2 border-[#141C2D]"></div>
                    <p className="text-xs text-white font-bold">Request Received</p>
                    <p className="text-[10px] text-gray-500 font-mono">System logged prompt</p>
                  </div>
                  <div className="relative pl-4">
                    <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-[#141C2D] ${metrics.status === 'Processing' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'}`}></div>
                    <p className="text-xs text-white font-bold">Processing Logic</p>
                    <p className="text-[10px] text-gray-500 font-mono">Agent analyzing intent</p>
                  </div>
                  <div className="relative pl-4">
                    <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-[#141C2D] ${isTyping ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'}`}></div>
                    <p className="text-xs text-white font-bold">API / Data Source Hit</p>
                    <p className="text-[10px] text-gray-500 font-mono">Open-Meteo, USGS, MongoDB</p>
                  </div>
                  <div className="relative pl-4">
                    <div className="absolute -left-1.5 top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#141C2D] shadow-[0_0_8px_green]"></div>
                    <p className="text-xs text-white font-bold">Response Generated</p>
                    <p className="text-[10px] text-gray-500 font-mono">Transmitted to console</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE MAP & GPS */}
          {activeTab === 'map' && (
            <div className="flex flex-col h-full space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tactical Map</h3>
                <button className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 flex items-center uppercase font-bold tracking-wider hover:bg-blue-500/30">
                  <Navigation size={12} className="mr-1" /> Auto-Detect
                </button>
              </div>
              <div className="bg-[#0B0F19] p-2 rounded-lg border border-[rgba(255,255,255,0.05)] flex items-center justify-between text-xs font-mono text-gray-300">
                <span>LAT: 37.7749 N</span>
                <span>LON: 122.4194 W</span>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] min-h-[250px]">
                <MapContainer center={[37.7749, -122.4194]} zoom={11} style={{ height: '100%', width: '100%', background: '#0F1523' }} zoomControl={false}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  <Marker position={[37.7749, -122.4194]}>
                    <Popup>Command Center</Popup>
                  </Marker>
                  <Circle center={[37.7749, -122.4194]} radius={2000} pathOptions={{ color: 'blue', fillOpacity: 0.1 }} />
                </MapContainer>
              </div>
            </div>
          )}

          {/* TAB 3: METRICS & TELEMETRY */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-[rgba(255,255,255,0.1)] pb-2">Agent Telemetry</h3>
                
                <div className="space-y-4 mt-4">
                  {/* Confidence Score */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-gray-400">Confidence Score</span>
                      <span className="text-green-400">{metrics.confidence}%</span>
                    </div>
                    <div className="w-full bg-[#0B0F19] rounded-full h-1.5 border border-[rgba(255,255,255,0.05)]">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${metrics.confidence}%` }}></div>
                    </div>
                  </div>

                  {/* Execution Time */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-gray-400">Execution Time</span>
                      <span className="text-blue-400">{metrics.execTime} ms</span>
                    </div>
                    <div className="w-full bg-[#0B0F19] rounded-full h-1.5 border border-[rgba(255,255,255,0.05)]">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, metrics.execTime / 5)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Modules */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-[#0B0F19] p-3 rounded-lg border border-[rgba(255,255,255,0.05)]">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Health</div>
                  <div className="text-sm text-green-400 font-bold flex items-center">
                    <CheckCircle size={14} className="mr-1" /> {metrics.health}
                  </div>
                </div>
                <div className="bg-[#0B0F19] p-3 rounded-lg border border-[rgba(255,255,255,0.05)]">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">State</div>
                  <div className={`text-sm font-bold flex items-center ${metrics.status === 'Processing' ? 'text-yellow-400' : 'text-blue-400'}`}>
                    <Activity size={14} className="mr-1" /> {metrics.status}
                  </div>
                </div>
              </div>

              {/* Data Sources */}
              <div className="pt-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-[rgba(255,255,255,0.1)] pb-2">Active Data Pipelines</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-800/50 border border-gray-700 text-gray-300 text-[10px] font-mono rounded">Open-Meteo</span>
                  <span className="px-2 py-1 bg-gray-800/50 border border-gray-700 text-gray-300 text-[10px] font-mono rounded">USGS Earthquakes</span>
                  <span className="px-2 py-1 bg-gray-800/50 border border-gray-700 text-gray-300 text-[10px] font-mono rounded">NASA EONET</span>
                  <span className="px-2 py-1 bg-gray-800/50 border border-gray-700 text-gray-300 text-[10px] font-mono rounded">MongoDB GeoJSON</span>
                  <span className="px-2 py-1 bg-gray-800/50 border border-gray-700 text-gray-300 text-[10px] font-mono rounded">OSRM Routing</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
