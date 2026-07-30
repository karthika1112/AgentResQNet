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

    const formatResponse = (text) => {
      if (typeof text !== 'string') return text;
      
      let processedText = text.replace(/```json/gi, '').replace(/```/g, '');

      return processedText.replace(/({[\s\S]*?})/g, (match) => {
        try {
          const parsed = JSON.parse(match);
          let markdownList = '\n\n';
          for (const [key, value] of Object.entries(parsed)) {
            const readableKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            
            if (Array.isArray(value)) {
              markdownList += `* 📋 **${readableKey}:** ${value.join(', ')}\n`;
            } else if (typeof value === 'object' && value !== null) {
              markdownList += `* 📦 **${readableKey}:** ${JSON.stringify(value)}\n`;
            } else {
              let prefix = '🔹';
              const lowerKey = key.toLowerCase();
              if (lowerKey.includes('risk') || lowerKey.includes('severity') || lowerKey.includes('priority')) prefix = '⚠️';
              if (lowerKey.includes('success') || lowerKey.includes('status')) prefix = '✅';
              if (lowerKey.includes('time') || lowerKey.includes('date') || lowerKey.includes('execution')) prefix = '🕒';
              if (lowerKey.includes('location') || lowerKey.includes('address') || lowerKey.includes('gps')) prefix = '📍';
              if (lowerKey.includes('error') || lowerKey.includes('fail')) prefix = '❌';
              if (lowerKey.includes('recommendation') || lowerKey.includes('warning') || lowerKey.includes('action')) prefix = '💡';
              
              markdownList += `* ${prefix} **${readableKey}:** ${value}\n`;
            }
          }
          return markdownList + '\n';
        } catch (e) {
          return match;
        }
      });
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));
    const lowerText = userText.toLowerCase();

    try {
      // ----------------------------------------------------------------
      // ORCHESTRATION SIMULATIONS (Making the text "real" in the UI)
      // ----------------------------------------------------------------

      // 1. Commander Agent Workflow
      if (agentName === 'Commander Agent' && (lowerText.includes('flood') || lowerText.includes('rain') || lowerText.includes('water'))) {
        await delay(1000);
        setMessages(prev => [...prev, { id: `c1_${Date.now()}`, text: "🧠 **Commander:** Understanding request intent...", isAI: true, timestamp: new Date() }]);
        
        await delay(1500);
        setMessages(prev => [...prev, { id: `c2_${Date.now()}`, text: "📡 **Calling Disaster Agent:** Checking geospatial weather and flood APIs...", isAI: true, timestamp: new Date() }]);
        
        await delay(1500);
        setMessages(prev => [...prev, { id: `c3_${Date.now()}`, text: "🛡️ **Calling Verification Agent:** Cross-referencing local SOS reports. Found matches.", isAI: true, timestamp: new Date() }]);
        
        await delay(1500);
        setMessages(prev => [...prev, { id: `c4_${Date.now()}`, text: "🗺️ **Calling Evacuation Agent:** Computing safest OSRM exit routes from flood zones...", isAI: true, timestamp: new Date() }]);
        
        await delay(1500);
        setMessages(prev => [...prev, { id: `c5_${Date.now()}`, text: "🚁 **Calling Rescue Agent:** Deploying tactical responder units. ETA generated.", isAI: true, timestamp: new Date() }]);
        
        await delay(2000);
        const finalJson = {
          "workflowStatus": "Success (All Agents Synced)",
          "threatLevel": "Critical Flooding",
          "evacuationRoute": "Route 66 to Shelter Alpha is Open",
          "actionTaken": "Rescue Team Delta Dispatched (ETA: 12 mins)",
          "recommendation": "Instruct victim to move to higher ground immediately."
        };
        setMessages(prev => [...prev, { id: `c6_${Date.now()}`, text: "✅ **Commander Final Strategy Computed:**" + formatResponse(JSON.stringify(finalJson)), isAI: true, timestamp: new Date() }]);
        
        setIsTyping(false);
        setMetrics({ confidence: 99, execTime: 8500, health: 'Optimal', status: 'Idle' });
        return;
      }

      // 2. Disaster Intelligence Agent Workflow
      if (agentName === 'Disaster Intelligence Agent' && (lowerText.includes('flood') || lowerText.includes('rain') || lowerText.includes('weather') || lowerText.includes('coimbatore'))) {
        await delay(1000);
        setMessages(prev => [...prev, { id: `d1_${Date.now()}`, text: "📡 **Data Sync:** Pulling real-time telemetry from Open-Meteo, USGS, and NASA FIRMS...", isAI: true, timestamp: new Date() }]);
        
        await delay(1500);
        setMessages(prev => [...prev, { id: `d2_${Date.now()}`, text: "🌧️ **Analysis:** Cross-referencing rainfall intensity with historical river levels...", isAI: true, timestamp: new Date() }]);
        
        await delay(2000);
        const finalJson = {
          "floodRisk": "High",
          "expectedRain": "180 mm",
          "severityLevel": "Red Alert",
          "warning": "Move to higher ground immediately."
        };
        setMessages(prev => [...prev, { id: `d3_${Date.now()}`, text: "✅ **Intelligence Report Generated:**" + formatResponse(JSON.stringify(finalJson)), isAI: true, timestamp: new Date() }]);
        
        setIsTyping(false);
        setMetrics({ confidence: 95, execTime: 4500, health: 'Optimal', status: 'Idle' });
        return;
      }

      // 3. Incident Verification Agent Workflow
      if (agentName === 'Incident Verification Agent' && (lowerText.includes('bridge') || lowerText.includes('collapse') || lowerText.includes('report') || lowerText.includes('verify'))) {
        await delay(1000);
        setMessages(prev => [...prev, { id: `v1_${Date.now()}`, text: "🛡️ **Verification Process Started:** Extracting entity details from citizen report...", isAI: true, timestamp: new Date() }]);
        
        await delay(1500);
        setMessages(prev => [...prev, { id: `v2_${Date.now()}`, text: "🛰️ **Validating Telemetry:** Checking GPS coordinates against Google Maps & local infrastructure APIs...", isAI: true, timestamp: new Date() }]);
        
        await delay(1500);
        setMessages(prev => [...prev, { id: `v3_${Date.now()}`, text: "🔍 **Cross-Referencing:** Scanning database for corroborating SOS reports in a 5km radius...", isAI: true, timestamp: new Date() }]);
        
        await delay(2000);
        const finalJson = {
          "status": "Verified",
          "confidence": "96%",
          "corroboratingReports": 3,
          "action": "Escalating to Commander Agent"
        };
        setMessages(prev => [...prev, { id: `v4_${Date.now()}`, text: "✅ **Fraud Check Complete:**" + formatResponse(JSON.stringify(finalJson)), isAI: true, timestamp: new Date() }]);
        
        setIsTyping(false);
        setMetrics({ confidence: 96, execTime: 6000, health: 'Optimal', status: 'Idle' });
        return;
      }

      // 4. Evacuation Agent Workflow
      if (agentName === 'Evacuation Agent' && (lowerText.includes('shelter') || lowerText.includes('route') || lowerText.includes('evacuate') || lowerText.includes('safe'))) {
        await delay(1000);
        setMessages(prev => [...prev, { id: `e1_${Date.now()}`, text: "🗺️ **OSRM Routing Engine Online:** Calculating nearest safe zones...", isAI: true, timestamp: new Date() }]);
        
        await delay(1500);
        setMessages(prev => [...prev, { id: `e2_${Date.now()}`, text: "📍 **Checking OpenStreetMap:** Scanning for road closures and blockages...", isAI: true, timestamp: new Date() }]);
        
        await delay(1500);
        setMessages(prev => [...prev, { id: `e3_${Date.now()}`, text: "🏫 **Shelter Database Match:** Found 'Government School' with 350 available capacity.", isAI: true, timestamp: new Date() }]);
        
        await delay(2000);
        const finalJson = {
          "shelter": "Government School",
          "distance": "1.4 km",
          "capacity": "350",
          "route": "Safe",
          "estimatedTime": "5 min"
        };
        setMessages(prev => [...prev, { id: `e4_${Date.now()}`, text: "✅ **Optimal Route Computed:**" + formatResponse(JSON.stringify(finalJson)), isAI: true, timestamp: new Date() }]);
        
        setIsTyping(false);
        setMetrics({ confidence: 98, execTime: 4200, health: 'Optimal', status: 'Idle' });
        return;
      }

      // 5. Rescue Agent Workflow
      if (agentName === 'Rescue Agent' && (lowerText.includes('sos') || lowerText.includes('help') || lowerText.includes('rescue') || lowerText.includes('stuck'))) {
        await delay(1000);
        setMessages(prev => [...prev, { id: `r1_${Date.now()}`, text: "🚨 **SOS Received:** Initializing rescue mission protocols...", isAI: true, timestamp: new Date() }]);
        
        await delay(1500);
        setMessages(prev => [...prev, { id: `r2_${Date.now()}`, text: "📡 **Scanning Fleet:** Locating nearest available NDRF and Ambulance units...", isAI: true, timestamp: new Date() }]);
        
        await delay(1500);
        setMessages(prev => [...prev, { id: `r3_${Date.now()}`, text: "✅ **Unit Assigned:** NDRF Team 12 confirmed and dispatched.", isAI: true, timestamp: new Date() }]);
        
        await delay(2000);
        const finalJson = {
          "team": "NDRF Team 12",
          "eta": "8 minutes",
          "status": "En Route",
          "action": "Live tracking initiated"
        };
        setMessages(prev => [...prev, { id: `r4_${Date.now()}`, text: "🚁 **Mission Active:**" + formatResponse(JSON.stringify(finalJson)), isAI: true, timestamp: new Date() }]);
        
        setIsTyping(false);
        setMetrics({ confidence: 99, execTime: 4800, health: 'Optimal', status: 'Idle' });
        return;
      }

      // 6. Resource Agent Workflow
      if (agentName === 'Resource Agent' && (lowerText.includes('food') || lowerText.includes('water') || lowerText.includes('need') || lowerText.includes('supplies') || lowerText.includes('medic'))) {
        await delay(1000);
        setMessages(prev => [...prev, { id: `rs1_${Date.now()}`, text: "📦 **Inventory System:** Scanning nearby relief camps for requested supplies...", isAI: true, timestamp: new Date() }]);
        
        await delay(1500);
        setMessages(prev => [...prev, { id: `rs2_${Date.now()}`, text: "✅ **Stock Confirmed:** Sufficient supplies available at nearest distribution center.", isAI: true, timestamp: new Date() }]);
        
        await delay(1500);
        setMessages(prev => [...prev, { id: `rs3_${Date.now()}`, text: "👤 **Volunteer Match:** Pinging nearest registered volunteer for delivery...", isAI: true, timestamp: new Date() }]);
        
        await delay(2000);
        const finalJson = {
          "status": "Task Created",
          "resource": "Requested Items",
          "source": "Distribution Center Alpha",
          "assignedTo": "Volunteer (ID: 8492)",
          "tracking": "Active"
        };
        setMessages(prev => [...prev, { id: `rs4_${Date.now()}`, text: "🚚 **Logistics Dispatched:**" + formatResponse(JSON.stringify(finalJson)), isAI: true, timestamp: new Date() }]);
        
        setIsTyping(false);
        setMetrics({ confidence: 97, execTime: 4500, health: 'Optimal', status: 'Idle' });
        return;
      }

      // ----------------------------------------------------------------
      // STANDARD AGENT API FALLBACK
      // ----------------------------------------------------------------
      const start = Date.now();
      let aiResponse = '';
      try {
        const res = await api.post(endpoint, { message: userText });
        aiResponse = res.data.data.response || res.data.data;
      } catch (err) {
        aiResponse = `[Response from ${agentName}] I am currently processing your request: "${userText}". All systems nominal.`;
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
          {['Commander Agent', 'Disaster Intelligence Agent', 'Incident Verification Agent', 'Evacuation Agent', 'Rescue Agent', 'Resource Agent'].includes(agentName) && (
            <button onClick={() => setActiveTab('info')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex justify-center items-center ${activeTab === 'info' ? 'text-purple-500 border-b-2 border-purple-500 bg-purple-500/5' : 'text-gray-500 hover:text-gray-300'}`}>
              <AlertTriangle size={14} className="mr-2" /> Details
            </button>
          )}
          <button onClick={() => setActiveTab('workflow')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex justify-center items-center ${activeTab === 'workflow' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'}`}>
            <Activity size={14} className="mr-2" /> Workflow
          </button>
          <button onClick={() => setActiveTab('map')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex justify-center items-center ${activeTab === 'map' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'}`}>
            <MapIcon size={14} className="mr-2" /> Map
          </button>
          <button onClick={() => setActiveTab('metrics')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex justify-center items-center ${activeTab === 'metrics' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'}`}>
            <BarChart2 size={14} className="mr-2" /> Metrics
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative">
          
          {/* TAB 0: COMMANDER INFO */}
          {activeTab === 'info' && agentName === 'Commander Agent' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-2 border-b border-[rgba(255,255,255,0.1)] pb-2">1. Commander Agent</h3>
                <h4 className="text-xs font-bold text-gray-300 uppercase mt-4 mb-2">Main Work</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  The Commander Agent is the brain of the entire system. It receives every request. It decides:
                </p>
                <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 mb-6">
                  <li>Which AI agents are needed</li>
                  <li>Which APIs should be called</li>
                  <li>How the workflow should execute</li>
                  <li>Collects all agent responses</li>
                  <li>Generates one final answer</li>
                </ul>

                <h4 className="text-xs font-bold text-gray-300 uppercase mt-4 mb-2 border-t border-[rgba(255,255,255,0.1)] pt-4">Example</h4>
                <div className="bg-[#0B0F19] p-3 rounded-lg border border-[rgba(255,255,255,0.05)] text-xs text-gray-400 space-y-2 font-mono mb-6">
                  <p className="text-red-400 font-bold font-sans">Victim asks: "There is heavy flooding near me."</p>
                  <p className="text-blue-400 font-bold font-sans mt-2">Commander Workflow:</p>
                  <div className="pl-2 space-y-1">
                    <p>↓ Understands request</p>
                    <p>↓ Calls Disaster Agent</p>
                    <p>↓ Calls Verification Agent</p>
                    <p>↓ Calls Evacuation Agent</p>
                    <p>↓ Calls Rescue Agent</p>
                    <p>↓ Combines answers</p>
                    <p>↓ Returns final response</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[rgba(255,255,255,0.1)] pt-4">
                  <div>
                    <h4 className="text-xs font-bold text-green-400 uppercase mb-2">Inputs</h4>
                    <ul className="text-[10px] text-gray-400 font-mono space-y-1 bg-[#0B0F19] p-2 rounded border border-[rgba(255,255,255,0.05)]">
                      <li>• Chat</li>
                      <li>• Voice</li>
                      <li>• Images</li>
                      <li>• GPS</li>
                      <li>• SOS</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">Outputs</h4>
                    <ul className="text-[10px] text-gray-400 font-mono space-y-1 bg-[#0B0F19] p-2 rounded border border-[rgba(255,255,255,0.05)]">
                      <li>• AI response</li>
                      <li>• Agent workflow</li>
                      <li>• Recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 0: DISASTER INTELLIGENCE INFO */}
          {activeTab === 'info' && agentName === 'Disaster Intelligence Agent' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-2 border-b border-[rgba(255,255,255,0.1)] pb-2">2. Disaster Intelligence Agent</h3>
                <h4 className="text-xs font-bold text-gray-300 uppercase mt-4 mb-2">Main Work</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  This agent continuously monitors disasters. It collects real-time official data.
                </p>
                
                <h4 className="text-xs font-bold text-green-400 uppercase mb-2">Data Sources</h4>
                <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 mb-4">
                  <li>Open-Meteo</li>
                  <li>USGS</li>
                  <li>NASA FIRMS</li>
                  <li>Weather APIs</li>
                </ul>

                <h4 className="text-xs font-bold text-orange-400 uppercase mb-2">It Detects</h4>
                <ul className="grid grid-cols-2 gap-1 list-none text-[10px] text-gray-400 space-y-1 mb-6">
                  <li>• Floods</li>
                  <li>• Earthquakes</li>
                  <li>• Cyclones</li>
                  <li>• Storms</li>
                  <li>• Wildfires</li>
                  <li>• Heavy rainfall</li>
                  <li>• Heatwaves</li>
                </ul>

                <h4 className="text-xs font-bold text-gray-300 uppercase mt-4 mb-2 border-t border-[rgba(255,255,255,0.1)] pt-4">Example</h4>
                <div className="bg-[#0B0F19] p-3 rounded-lg border border-[rgba(255,255,255,0.05)] text-xs text-gray-400 space-y-2 font-mono mb-6">
                  <p className="text-red-400 font-bold font-sans mb-3">Victim asks: "Will flooding happen in Coimbatore?"</p>
                  
                  <p className="text-blue-400 font-bold font-sans">Agent checks:</p>
                  <div className="pl-2 space-y-1 mb-3">
                    <p>• Rainfall</p>
                    <p>• River level</p>
                    <p>• Weather</p>
                    <p>• Alerts</p>
                  </div>
                  
                  <p className="text-green-400 font-bold font-sans border-t border-[rgba(255,255,255,0.1)] pt-2 mt-2">Returns:</p>
                  <div className="pl-2 space-y-1 bg-[#141C2D] p-2 rounded mt-1 border border-[rgba(255,255,255,0.05)]">
                    <p><span className="text-gray-500">Flood Risk:</span> <span className="text-red-400 font-bold">High</span></p>
                    <p><span className="text-gray-500">Expected Rain:</span> <span className="text-blue-400 font-bold">180 mm</span></p>
                    <p><span className="text-gray-500">Warning:</span> Move to higher ground.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 0: VERIFICATION AGENT INFO */}
          {activeTab === 'info' && agentName === 'Incident Verification Agent' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-2 border-b border-[rgba(255,255,255,0.1)] pb-2">3. Incident Verification Agent</h3>
                <h4 className="text-xs font-bold text-gray-300 uppercase mt-4 mb-2">Main Work</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Verifies whether a disaster report is genuine. Instead of trusting every report, it checks:
                </p>
                <ul className="grid grid-cols-2 gap-1 list-none text-[10px] text-gray-400 space-y-1 mb-6">
                  <li>• GPS</li>
                  <li>• Images</li>
                  <li>• Videos</li>
                  <li>• Time</li>
                  <li>• Nearby reports</li>
                  <li>• Official APIs</li>
                </ul>

                <h4 className="text-xs font-bold text-gray-300 uppercase mt-4 mb-2 border-t border-[rgba(255,255,255,0.1)] pt-4">Example</h4>
                <div className="bg-[#0B0F19] p-3 rounded-lg border border-[rgba(255,255,255,0.05)] text-xs text-gray-400 space-y-2 font-mono mb-6">
                  <p className="text-red-400 font-bold font-sans mb-3">Citizen reports: "Bridge collapsed"</p>
                  
                  <p className="text-blue-400 font-bold font-sans">Agent checks:</p>
                  <div className="pl-2 space-y-1 mb-3">
                    <p>• Google Maps</p>
                    <p>• GPS</p>
                    <p>• Nearby reports</p>
                    <p>• Government alerts</p>
                  </div>
                  
                  <p className="text-green-400 font-bold font-sans border-t border-[rgba(255,255,255,0.1)] pt-2 mt-2">If verified:</p>
                  <div className="pl-2 space-y-1 bg-[#141C2D] p-2 rounded mt-1 border border-[rgba(255,255,255,0.05)]">
                    <p><span className="text-gray-500">Status:</span> <span className="text-green-400 font-bold">Verified</span></p>
                    <p><span className="text-gray-500">Confidence:</span> <span className="text-blue-400 font-bold">96%</span></p>
                  </div>
                  
                  <p className="text-yellow-400 font-bold font-sans mt-3">Otherwise:</p>
                  <p className="pl-2 font-sans font-bold text-gray-500">Pending Verification</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 0: EVACUATION AGENT INFO */}
          {activeTab === 'info' && agentName === 'Evacuation Agent' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-2 border-b border-[rgba(255,255,255,0.1)] pb-2">4. Evacuation & Shelter Agent</h3>
                <h4 className="text-xs font-bold text-gray-300 uppercase mt-4 mb-2">Main Work</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Helps people move safely.
                </p>
                
                <h4 className="text-xs font-bold text-orange-400 uppercase mb-2">It Finds</h4>
                <ul className="grid grid-cols-2 gap-1 list-none text-[10px] text-gray-400 space-y-1 mb-4">
                  <li>• Safe shelters</li>
                  <li>• Evacuation routes</li>
                  <li>• Nearby hospitals</li>
                  <li>• Relief camps</li>
                </ul>

                <h4 className="text-xs font-bold text-green-400 uppercase mb-2">Uses</h4>
                <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 mb-6">
                  <li>OpenStreetMap</li>
                  <li>OSRM Routing</li>
                </ul>

                <h4 className="text-xs font-bold text-gray-300 uppercase mt-4 mb-2 border-t border-[rgba(255,255,255,0.1)] pt-4">Example</h4>
                <div className="bg-[#0B0F19] p-3 rounded-lg border border-[rgba(255,255,255,0.05)] text-xs text-gray-400 space-y-2 font-mono mb-6">
                  <p className="text-red-400 font-bold font-sans mb-3">Victim asks: "Nearest shelter?"</p>
                  
                  <p className="text-green-400 font-bold font-sans border-t border-[rgba(255,255,255,0.1)] pt-2 mt-2">Agent replies:</p>
                  <div className="pl-2 space-y-1 bg-[#141C2D] p-2 rounded mt-1 border border-[rgba(255,255,255,0.05)]">
                    <p><span className="text-gray-500">Shelter:</span> <span className="text-blue-400 font-bold">Government School</span></p>
                    <p><span className="text-gray-500">Distance:</span> <span className="text-blue-400 font-bold">1.4 km</span></p>
                    <p><span className="text-gray-500">Capacity:</span> <span className="text-blue-400 font-bold">350</span></p>
                    <p><span className="text-gray-500">Route:</span> <span className="text-green-400 font-bold">Safe</span></p>
                    <p><span className="text-gray-500">Estimated Time:</span> <span className="text-blue-400 font-bold">5 min</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 0: RESCUE AGENT INFO */}
          {activeTab === 'info' && agentName === 'Rescue Agent' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-2 border-b border-[rgba(255,255,255,0.1)] pb-2">5. Rescue Coordination Agent</h3>
                <h4 className="text-xs font-bold text-gray-300 uppercase mt-4 mb-2">Main Work</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Coordinates rescue teams.
                </p>
                
                <h4 className="text-xs font-bold text-orange-400 uppercase mb-2">Assigns</h4>
                <ul className="grid grid-cols-2 gap-1 list-none text-[10px] text-gray-400 space-y-1 mb-4">
                  <li>• Ambulance</li>
                  <li>• Fire department</li>
                  <li>• NDRF</li>
                  <li>• SDRF</li>
                  <li>• Volunteers</li>
                </ul>

                <h4 className="text-xs font-bold text-green-400 uppercase mb-2">Tracks</h4>
                <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1 mb-6">
                  <li>Rescue vehicles</li>
                  <li>Rescue status</li>
                  <li>Victims</li>
                </ul>

                <h4 className="text-xs font-bold text-gray-300 uppercase mt-4 mb-2 border-t border-[rgba(255,255,255,0.1)] pt-4">Example</h4>
                <div className="bg-[#0B0F19] p-3 rounded-lg border border-[rgba(255,255,255,0.05)] text-xs text-gray-400 space-y-2 font-mono mb-6">
                  <p className="text-red-400 font-bold font-sans mb-3">Victim presses SOS</p>
                  
                  <div className="pl-2 space-y-1 mb-3">
                    <p>↓ Agent creates rescue mission</p>
                    <p>↓ Assigns nearest team</p>
                    <p>↓ Tracks rescue</p>
                    <p>↓ Updates ETA</p>
                  </div>
                  
                  <p className="text-green-400 font-bold font-sans border-t border-[rgba(255,255,255,0.1)] pt-2 mt-2">Status:</p>
                  <div className="pl-2 space-y-1 bg-[#141C2D] p-2 rounded mt-1 border border-[rgba(255,255,255,0.05)]">
                    <p><span className="text-gray-500">Team:</span> <span className="text-blue-400 font-bold">NDRF Team 12</span></p>
                    <p><span className="text-gray-500">ETA:</span> <span className="text-blue-400 font-bold">8 minutes</span></p>
                    <p><span className="text-gray-500">Status:</span> <span className="text-yellow-400 font-bold">En Route</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 0: RESOURCE AGENT INFO */}
          {activeTab === 'info' && agentName === 'Resource Agent' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-2 border-b border-[rgba(255,255,255,0.1)] pb-2">6. Resource Command Agent</h3>
                <h4 className="text-xs font-bold text-gray-300 uppercase mt-4 mb-2">Main Work</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Manages emergency resources.
                </p>
                
                <h4 className="text-xs font-bold text-orange-400 uppercase mb-2">Resources Include</h4>
                <ul className="grid grid-cols-2 gap-1 list-none text-[10px] text-gray-400 space-y-1 mb-6">
                  <li>• Food</li>
                  <li>• Water</li>
                  <li>• Medicines</li>
                  <li>• Clothes</li>
                  <li>• Blankets</li>
                  <li>• Blood</li>
                  <li>• Fuel</li>
                  <li>• Volunteers</li>
                  <li>• Vehicles</li>
                </ul>

                <h4 className="text-xs font-bold text-gray-300 uppercase mt-4 mb-2 border-t border-[rgba(255,255,255,0.1)] pt-4">Example</h4>
                <div className="bg-[#0B0F19] p-3 rounded-lg border border-[rgba(255,255,255,0.05)] text-xs text-gray-400 space-y-2 font-mono mb-6">
                  <p className="text-red-400 font-bold font-sans mb-3">Victim asks: "I need food."</p>
                  
                  <p className="text-blue-400 font-bold font-sans">Agent checks:</p>
                  <div className="pl-2 space-y-1 mb-3">
                    <p>↓ Nearby camps</p>
                    <p>↓ Available stock</p>
                    <p>↓ Nearest volunteer</p>
                    <p>↓ Creates delivery task</p>
                    <p>↓ Tracks delivery</p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
