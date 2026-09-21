import { useState, useRef, useEffect } from 'react';
import { PROPERTIES, formatPrice } from '../data/mockData';
const SAMPLE_QUESTIONS = [
    '3-bedroom apartment in Westlands under KES 100,000/month',
    'What\'s the average property price in Karen?',
    'Compare renting vs buying in Nairobi right now',
    'Best areas to invest in Nairobi for rental yield',
];
const AI_RESPONSES = {
    default: "I can search STARA's property inventory, explain verification, compare saved homes, estimate affordability, and help arrange a viewing. Tell me your preferred location, budget, bedrooms, and whether you want to rent or buy.",
    "karen": "Karen's average property prices are: Apartments (KES 15–40M), Villas (KES 40–120M+), Land (KES 15–50M per acre). Rental yields average 5–6% — lower than Westlands but strong capital appreciation of 12–15% annually. Karen is ideal for long-term investment.",
    "renting vs buying": "In Nairobi's current market (2026): **Buying** is better if you plan to stay 5+ years and can access a mortgage. Property appreciation in prime areas has been 8–14% annually. **Renting** is better for flexibility and short-term plans. Break-even point is typically 5–7 years in Nairobi. Key: check your mortgage affordability first — STARA's financial tools can calculate this for you.",
    "investment": "Top Nairobi areas for rental yield in 2026: 1. Kilimani (8.2% gross yield) 2. Westlands (7.8%) 3. Syokimau (9.1%) 4. Embakasi (9.8%) 5. Parklands (7.4%). Syokimau and Embakasi offer the best yields due to strong demand from working professionals near JKIA and the SGR.",
};
function parseIntent(message) {
    const lower = message.toLowerCase();
    const number = lower.match(/(?:kes|ksh|k)\s?([\d,.]+)\s?(m|million|k|thousand)?/i);
    let maxPrice = null;
    if (number) {
        const value = Number(number[1].replace(/,/g, ''));
        maxPrice = number[2]?.toLowerCase().startsWith('m') ? value * 1000000 : number[2]?.toLowerCase().startsWith('k') ? value * 1000 : value;
    }
    const bedroomMatch = lower.match(/(\d+)\s?-?\s*bed(?:room)?s?/);
    const location = PROPERTIES
        .flatMap(property => [property.location.neighborhood, property.location.town, property.location.county])
        .filter(Boolean)
        .sort((a, b) => b.length - a.length)
        .find(place => lower.includes(place.toLowerCase()));
    const type = ['apartment', 'house', 'villa', 'townhouse', 'maisonette', 'bungalow', 'land', 'office']
        .find(value => lower.includes(value));
    return {
        purpose: lower.includes('rent') || lower.includes('month') ? 'rent' : lower.includes('buy') || lower.includes('sale') || lower.includes('land') ? 'sale' : null,
        propertyType: type || null,
        location: location || null,
        bedrooms: bedroomMatch ? Number(bedroomMatch[1]) : null,
        maxPrice,
        amenities: lower.includes('parking') ? ['Parking'] : [],
    };
}
function findMatchingProperties(intent) {
    return PROPERTIES.filter(property => {
        if (intent.purpose && property.listing !== intent.purpose) return false;
        if (intent.propertyType && property.type !== intent.propertyType) return false;
        if (intent.location) {
            const places = [property.location.neighborhood, property.location.town, property.location.county].filter(Boolean).map(place => place.toLowerCase());
            if (!places.includes(intent.location.toLowerCase())) return false;
        }
        if (intent.bedrooms && property.bedrooms < intent.bedrooms) return false;
        if (intent.maxPrice && property.price > intent.maxPrice) return false;
        if (intent.amenities.length && !intent.amenities.every(item => property.amenities.includes(item))) return false;
        return true;
    }).slice(0, 6);
}
function getAIResponse(message) {
    const lower = message.toLowerCase();
    if (lower.includes('karen'))
        return AI_RESPONSES.karen;
    if (lower.includes('rent') && lower.includes('buy'))
        return AI_RESPONSES["renting vs buying"];
    if (lower.includes('invest') || lower.includes('yield'))
        return AI_RESPONSES.investment;
    const intent = parseIntent(message);
    const matches = findMatchingProperties(intent);
    if (matches.length) return `I found ${matches.length} ${matches.length === 1 ? 'property' : 'properties'} in STARA's inventory matching your request. Review the verified details below, then choose a property to continue.`;
    if (intent.location || intent.maxPrice || intent.bedrooms) return 'I could not find an exact match in the current STARA inventory. Try widening the location, budget, or bedroom range.';
    return AI_RESPONSES.default;
}
export default function AIAssistantPage({ navigate, onClose, floating = false }) {
    const [messages, setMessages] = useState([
        {
            id: '0',
            role: 'assistant',
            content: "Hi! I'm Ask STARA. I can help you find the perfect property, analyse investments, understand the Kenyan market, and answer any real estate questions. What are you looking for?",
            time: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [voiceListening, setVoiceListening] = useState(false);
    const [voiceError, setVoiceError] = useState('');
    const [voiceSupported] = useState(() => typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
    const bottomRef = useRef(null);
    const recognitionRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    const sendMessage = async (text) => {
        const msg = text || input;
        if (!msg.trim())
            return;
        setInput('');
        const userMsg = { id: Date.now().toString(), role: 'user', content: msg, time: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        const intent = parseIntent(msg);
        const results = findMatchingProperties(intent);
        const aiMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: getAIResponse(msg), results, time: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, aiMsg]);
        setLoading(false);
    };
    const startVoice = () => {
        if (!voiceSupported) {
            setVoiceError('Voice recognition is not supported in this browser.');
            return;
        }
        if (voiceListening) {
            recognitionRef.current?.stop();
            return;
        }
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new Recognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-KE';
        recognition.interimResults = false;
        recognition.onstart = () => {
            setVoiceError('');
            setVoiceListening(true);
        };
        recognition.onend = () => {
            recognitionRef.current = null;
            setVoiceListening(false);
        };
        recognition.onerror = event => {
            recognitionRef.current = null;
            setVoiceListening(false);
            setVoiceError(event.error === 'not-allowed' ? 'Allow microphone access to use voice search.' : 'Voice recognition stopped. Please try again.');
        };
        recognition.onresult = event => {
            setInput(event.results[0][0].transcript);
            setVoiceError('');
        };
        recognition.start();
    };
    const containerClass = floating
        ? 'fixed bottom-[8.25rem] sm:bottom-24 right-4 z-40 w-[calc(100vw-2rem)] max-w-sm h-[min(500px,calc(100vh-13rem))] min-h-[360px] bg-white rounded-2xl shadow-2xl border border-[#E7E5E0] flex flex-col animate-fade-in'
        : 'bg-[#FAFAF8] min-h-screen flex flex-col';
    const innerClass = floating ? '' : 'max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col';
    return (<div className={containerClass}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b border-[#E7E5E0] ${floating ? '' : 'bg-[#1A2234] text-white'}`} style={!floating ? {} : {}}>
        {!floating && (<div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-lg">Ask STARA</p>
                <p className="text-[#8B949E] text-xs">Property intelligence assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full"/>
              <span className="text-[#8B949E] text-xs">Online</span>
            </div>
          </div>)}
        {floating && (<>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#1C1917] text-sm">Ask STARA</p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"/>
                  <span className="text-[10px] text-[#78716C]">Online</span>
                </div>
              </div>
            </div>
            {onClose && (<button type="button" onClick={onClose} aria-label="Close Ask STARA" title="Close Ask STARA" className="w-9 h-9 rounded-lg border border-[#E7E5E0] hover:bg-[#F5F4F0] text-[#57534E] flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>)}
          </>)}
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto ${floating ? 'p-4' : 'max-w-3xl mx-auto w-full px-4 sm:px-6 py-6'} space-y-4`}>
        {/* Sample questions (only on first load) */}
        {messages.length === 1 && (<div className="space-y-2">
            <p className="text-xs text-[#A8A29E] text-center">Try asking:</p>
            {SAMPLE_QUESTIONS.map(q => (<button key={q} onClick={() => sendMessage(q)} className="w-full text-left px-3 py-2.5 bg-[#F5F4F0] hover:bg-[#E7E5E0] rounded-xl text-sm text-[#57534E] transition-colors">
                {q}
              </button>))}
          </div>)}

        {messages.map(msg => (<div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
            {msg.role === 'assistant' && (<div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>)}
            <div className={`max-w-xs sm:max-w-sm ${floating ? 'max-w-[85%]' : ''}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#E85D04] text-white rounded-tr-md' : 'bg-white border border-[#E7E5E0] text-[#1C1917] rounded-tl-md'}`}>
                {msg.content}
                  {msg.results?.length > 0 && (<div className="mt-3 space-y-3">
                    {msg.results.map(property => (<div key={property.id} className="overflow-hidden rounded-xl border border-[#E7E5E0] bg-[#FAFAF8]">
                      <img src={property.images[0]} alt={property.title} className="h-28 w-full object-cover"/>
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm">{property.title}</p>
                          {property.verified && <span className="shrink-0 text-[10px] text-green-700 font-semibold">Verified</span>}
                        </div>
                        <p className="text-xs text-[#78716C] mt-1">{property.location.neighborhood}, {property.location.county}</p>
                        <p className="font-bold text-[#E85D04] mt-2">{formatPrice(property.price, property.pricePeriod)}</p>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => navigate('property', property.id)} className="flex-1 rounded-lg bg-[#1A2234] px-2 py-2 text-xs font-semibold text-white">View</button>
                          <button onClick={() => navigate('property', property.id)} className="flex-1 rounded-lg border border-[#E7E5E0] px-2 py-2 text-xs font-semibold">Ask about it</button>
                        </div>
                      </div>
                    </div>))}
                  </div>)}
              </div>
              <p className="text-[10px] text-[#A8A29E] mt-1 px-1">{msg.time}</p>
            </div>
          </div>))}

        {loading && (<div className="flex justify-start gap-2">
            <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <div className="px-4 py-3 bg-white border border-[#E7E5E0] rounded-2xl rounded-tl-md flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#E85D04] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
              <div className="w-2 h-2 bg-[#E85D04] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
              <div className="w-2 h-2 bg-[#E85D04] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
            </div>
          </div>)}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div className={`border-t border-[#E7E5E0] p-4 ${floating ? '' : 'max-w-3xl mx-auto w-full px-4 sm:px-6 pb-8'}`}>
        <div className="flex gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Ask STARA..." aria-label="Ask STARA" className="flex-1 px-4 py-3 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20"/>
          <button onClick={startVoice} aria-label={voiceSupported ? (voiceListening ? 'Stop voice input' : 'Use voice input') : 'Voice input unavailable'} title={voiceSupported ? (voiceListening ? 'Stop listening' : 'Speak to Ask STARA') : 'Voice input is not supported on this device'} className={`px-3 py-3 rounded-xl border border-[#E7E5E0] ${voiceListening ? 'text-[#E85D04] bg-[#FFF7ED]' : 'text-[#78716C]'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3 3 0 003-3V7a3 3 0 10-6 0v8a3 3 0 003 3zm-6-3a6 6 0 0012 0M12 21v-3"/></svg>
          </button>
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="px-4 py-3 rounded-xl text-white disabled:opacity-50 transition-all" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>
        <p className={`text-[10px] text-center mt-2 ${voiceError ? 'text-red-600' : voiceListening ? 'text-[#E85D04]' : 'text-[#A8A29E]'}`}>
          {voiceError || (voiceListening ? 'Listening… tap the microphone to stop.' : 'Ask STARA provides general guidance. Always verify before transacting.')}
        </p>
      </div>
    </div>);
}
