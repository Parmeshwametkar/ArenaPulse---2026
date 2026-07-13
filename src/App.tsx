import { useState } from 'react';
import { Header } from './components/Header';
import { LiveDashboard } from './components/LiveDashboard';
import { FanAssistant } from './components/FanAssistant';
import { StadiumMap } from './components/StadiumMap';
import { SettingsModal } from './components/SettingsModal';
import { ExternalLink, Calendar, MapPin, Compass } from 'lucide-react';

interface ZoneDetails {
  name: string;
  capacity: number;
  waitTime: number;
  status: 'Optimal' | 'Fluid' | 'Congested' | 'Busy' | 'Light' | 'Clear';
  activeGates: string;
  alertText: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const ZONE_DATA: Record<string, ZoneDetails> = {
  stadium: {
    name: "Entire Stadium (General)",
    capacity: 84,
    waitTime: 14,
    status: 'Optimal',
    activeGates: "8/8",
    alertText: "All stadium entry gates are operational. Gate A (North) currently has the lowest congestion with a wait time of under 8 minutes."
  },
  gate_a: {
    name: "Gate A (North Concourse)",
    capacity: 78,
    waitTime: 8,
    status: 'Fluid',
    activeGates: "2/2",
    alertText: "Gate A flow is currently fluid. High throughput is keeping wait times short. Recommended entry route for Sections 100-220."
  },
  gate_b: {
    name: "Gate B (South Concourse)",
    capacity: 95,
    waitTime: 25,
    status: 'Congested',
    activeGates: "2/2",
    alertText: "Gate B is experiencing heavy incoming traffic due to shuttle arrivals. Recommend diverting to Gate A to reduce entry wait time."
  },
  food_court: {
    name: "Concessions & Food Court",
    capacity: 90,
    waitTime: 18,
    status: 'Busy',
    activeGates: "N/A",
    alertText: "Central Concourse food options are facing high volumes before kickoff. Sub-stands in Section 302 and Section 320 have shorter queues."
  },
  restrooms: {
    name: "West Restroom Block",
    capacity: 60,
    waitTime: 3,
    status: 'Light',
    activeGates: "N/A",
    alertText: "West restrooms are clean and have minimal wait. East block is busier; fans on the East deck are advised to walk to Section 112."
  },
  emergency_medical: {
    name: "Medical Station (Section 104)",
    capacity: 15,
    waitTime: 1,
    status: 'Clear',
    activeGates: "N/A",
    alertText: "Medical responders are on standby. Station is clear. For general emergencies, locate the nearest steward or press the SOS button."
  }
};

function App() {
  // Zone selection state
  const [selectedZone, setSelectedZone] = useState<string>('stadium');
  
  // API Key state loaded from LocalStorage
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('arenapulse_gemini_key') || '';
  });

  // Settings Modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Chat conversation history state
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Welcome to the **FIFA World Cup 2026**! 🏆 I am **ArenaPulse AI**, your elite stadium concierge. 

I can guide you instantly through stadium logistics and venue experiences:
* 🗺️ **Gate Directions** and wayfinding
* ⏱️ **Queue status** and live wait times
* 🍔 **Food court** and restroom locations
* 🌐 **Multilingual translations** (e.g., Spanish, French, etc.)

*Note: I focus exclusively on stadium operations. For game scores, match updates, or world events, please consult official tournament screens.*`
    }
  ]);
  
  // Chat input field text state
  const [chatInput, setChatInput] = useState('');
  
  // Loading spinner state for API requests
  const [chatLoading, setChatLoading] = useState(false);

  // Check if API key is active (either via local state or we assume backend might have it configured)
  // To keep UX clean, if local key is absent, we'll display a warning badge, but still let requests go through 
  // in case the server has a backend process.env.GEMINI_API_KEY.
  const isApiKeyConfigured = apiKey.trim().length > 0;

  // Handle saving API key from Settings Modal
  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('arenapulse_gemini_key', key);
  };

  // Chat request function
  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage || chatInput).trim();
    if (!textToSend) return;

    // Clear input
    setChatInput('');
    
    // Add user message to history local view
    const updatedMessages = [...messages, { role: 'user', content: textToSend } as Message];
    setMessages(updatedMessages);
    setChatLoading(true);

    try {
      // API call endpoint configuration
      const apiBase = '';
      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gemini-Key': apiKey.trim()
        },
        body: JSON.stringify({
          message: textToSend,
          history: updatedMessages // Sends full conversation log for context
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Server responded with an error");
      }

      // Add AI response to log
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);

    } catch (error: any) {
      console.error("Chat Error:", error);
      
      // Standard user-friendly error injection
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ **Operational Concierge Error:** 
        
${error.message || "Failed to establish a connection with the ArenaPulse AI server. Please make sure the server is active on port 3000 and your API Key settings are correct."}

*Tip: You can update your API Key by clicking the gear icon in the top right header.*`
      }]);
    } finally {
      setChatLoading(false);
    }
  };



  // Get operational data for currently selected zone
  const currentData = ZONE_DATA[selectedZone] || ZONE_DATA.stadium;

  return (
    <div className="min-h-screen flex flex-col bg-stadium-bg">
      {/* Sticky header navbar */}
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        isApiKeyConfigured={isApiKeyConfigured}
      />

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
        
        {/* Quick Intro Banner */}
        <div className="w-full bg-gradient-to-r from-emerald-950/20 via-slate-900/40 to-cyan-950/20 border border-emerald-950/60 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-stadium-neonCyan animate-spin" style={{ animationDuration: '60s' }} />
              ArenaPulse 2026: Smart Stadium Companion
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Tailored for fans at the <span className="text-white font-semibold">FIFA World Cup 2026</span>. Monitor capacity in real-time, navigate through interactive stadium gate mapping, and consult the AI concierge for prompt wayfinding.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/70 border border-slate-900 rounded-xl text-slate-400 font-semibold font-mono">
              <MapPin className="w-3.5 h-3.5 text-stadium-neonGreen" />
              MetLife Stadium
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/70 border border-slate-900 rounded-xl text-slate-400 font-semibold font-mono">
              <Calendar className="w-3.5 h-3.5 text-stadium-neonCyan" />
              July 2026
            </div>
          </div>
        </div>

        {/* 3-Card Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow items-stretch">
          
          {/* CARD 1: Live Operations Dashboard */}
          <div className="h-full">
            <LiveDashboard
              zoneKey={selectedZone}
              zoneName={currentData.name}
              capacity={currentData.capacity}
              waitTime={currentData.waitTime}
              status={currentData.status}
              activeGates={currentData.activeGates}
              alertText={currentData.alertText}
              onReset={() => setSelectedZone('stadium')}
            />
          </div>

          {/* CARD 2: Fan Assistant AI Chat */}
          <div className="h-full">
            <FanAssistant
              messages={messages}
              inputValue={chatInput}
              onChangeInput={setChatInput}
              onSendMessage={handleSendMessage}
              isLoading={chatLoading}
              isApiKeyConfigured={isApiKeyConfigured}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </div>

          {/* CARD 3: Interactive Gate & Wayfinding Map */}
          <div className="h-full">
            <StadiumMap
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
            />
          </div>

        </div>
      </main>

      {/* Footer Info bar */}
      <footer className="w-full bg-slate-950 py-4 px-6 border-t border-slate-900 mt-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-bold text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-stadium-neonGreen animate-ping" />
            <span>METADATA // CORE SYSTEMS SECURE</span>
          </div>
          <div>
            <span>FIFA WORLD CUP 2026 OFFICIAL FAN COMPANION</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>STADIUM API VERSION 1.1</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
          </div>
        </div>
      </footer>

      {/* API Configuration Overlay Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        savedApiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}

export default App;
