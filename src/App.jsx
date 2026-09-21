import { useState } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AIAssistantPage from './pages/AIAssistantPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AgentCRMPage from './pages/AgentCRMPage';
import LandlordPage from './pages/LandlordPage';
import TenantPage from './pages/TenantPage';
import InvestorPage from './pages/InvestorPage';
import ProfessionalsPage from './pages/ProfessionalsPage';
import NewsroomPage from './pages/NewsroomPage';
import GalleryPage from './pages/GalleryPage';
import FinancialToolsPage from './pages/FinancialToolsPage';
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import InstallPrompt from './components/InstallPrompt';
// Placeholder pages for Community and Help
function CommunityPage({ navigate }) {
    return (<div className="bg-[#FAFAF8] min-h-screen">
      <div className="bg-[#1A2234] py-14 text-center">
        <p className="text-[#F4A100] text-sm font-semibold uppercase tracking-widest mb-2">Connect</p>
        <h1 className="text-3xl font-bold text-white mb-3">STARA Community</h1>
        <p className="text-[#8B949E]">Discussions, Q&amp;A and neighborhood communities</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 gap-5">
          {['General Discussion', 'Q&A – Buying', 'Q&A – Renting', 'Investor Community', 'Landlord Community', 'Tenant Community', 'Neighborhood Nairobi', 'Neighborhood Mombasa'].map(topic => (<button key={topic} className="bg-white rounded-2xl p-5 border border-[#E7E5E0] text-left hover:shadow-md hover:border-[#E85D04]/40 transition-all">
              <p className="font-bold text-[#1C1917]">{topic}</p>
              <p className="text-xs text-[#78716C] mt-1">{Math.floor(Math.random() * 200 + 50)} members · {Math.floor(Math.random() * 30 + 5)} posts today</p>
            </button>))}
        </div>
      </div>
    </div>);
}
function HelpPage({ navigate }) {
    const [q, setQ] = useState('');
    const FAQS = [
        { q: 'How do I verify a property listing?', a: 'Verified listings display the green STARA Verified badge. This confirms title deed, listing details and agent identity have been reviewed.' },
        { q: 'How do I schedule a property viewing?', a: 'On any property page, click "Schedule Viewing", choose your date and preferred time, and confirm. You\'ll receive a notification once the agent confirms.' },
        { q: 'Can I list my property for free?', a: 'Yes — your first listing is free. Premium featured placements and promotion packages are available on the listings dashboard.' },
        { q: 'How do I report a suspicious listing?', a: 'On any property detail page, scroll down and click "Report this listing". Our team reviews all reports within 24 hours.' },
        { q: 'Is STARA available outside Kenya?', a: 'STARA serves all of Kenya and is Africa-ready. Watch for expansion announcements in the Newsroom.' },
        { q: 'How do I change my role on STARA?', a: 'Go to Profile → Settings → Role Management to switch between your registered roles.' },
    ];
    const filtered = q ? FAQS.filter(f => f.q.toLowerCase().includes(q.toLowerCase())) : FAQS;
    return (<div className="bg-[#FAFAF8] min-h-screen">
      <div className="bg-[#1A2234] py-14 text-center">
        <h1 className="text-3xl font-bold text-white mb-3">Help Center</h1>
        <p className="text-[#8B949E] mb-6">How can we help you today?</p>
        <div className="max-w-md mx-auto relative px-4">
          <svg className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search FAQs..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#F4A100]"/>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        {filtered.map((faq, i) => (<details key={i} className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden group">
            <summary className="p-5 font-semibold text-[#1C1917] cursor-pointer flex items-center justify-between">
              {faq.q}
              <svg className="w-5 h-5 text-[#78716C] transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <p className="px-5 pb-5 text-sm text-[#57534E] leading-relaxed">{faq.a}</p>
          </details>))}
        <div className="bg-[#FFF7F0] rounded-2xl p-6 text-center border border-[#F4A100]/30 mt-8">
          <p className="font-bold text-[#1C1917] mb-1">Still need help?</p>
          <p className="text-sm text-[#78716C] mb-4">Our support team is available Mon–Fri 8am–6pm EAT</p>
          <div className="flex gap-3 justify-center">
            <button className="px-5 py-2.5 bg-[#E85D04] text-white font-semibold rounded-xl text-sm">Submit Ticket</button>
            <button className="px-5 py-2.5 border border-[#E85D04] text-[#E85D04] font-semibold rounded-xl text-sm">Live Chat</button>
          </div>
        </div>
      </div>
    </div>);
}
// Agency page placeholder
function AgencyPage({ navigate }) {
    return (<div className="bg-[#FAFAF8] min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <span className="text-5xl block mb-4">🏢</span>
        <h2 className="text-2xl font-bold text-[#1C1917] mb-2">Agency Platform</h2>
        <p className="text-[#78716C] mb-6 max-w-sm">Manage your agency, team of agents, listings, and performance.</p>
        <button onClick={() => navigate('agent')} className="px-6 py-3 bg-[#E85D04] text-white font-semibold rounded-xl">Go to Agent Dashboard</button>
      </div>
    </div>);
}
export default function App() {
    return (<UserProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </UserProvider>);
}
function AppShell() {
    const [currentPage, setCurrentPage] = useState('home');
    const [pageHistory, setPageHistory] = useState(['home']);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [searchFilter, setSearchFilter] = useState('all');
    const { user, signIn, signOut, notifications } = useUser();
    const [showAuth, setShowAuth] = useState(false);
    const [showAI, setShowAI] = useState(false);
    const navigate = (page, propertyId, nextSearchFilter) => {
        setShowAI(false);
        setCurrentPage(page);
        if (propertyId)
            setSelectedPropertyId(propertyId);
        if (page === 'search')
            setSearchFilter(nextSearchFilter ?? 'all');
        setPageHistory((prev) => {
            if (prev[prev.length - 1] === page) return prev;
            return [...prev, page];
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const goBack = () => {
        setPageHistory((prev) => {
            if (prev.length <= 1) {
                setCurrentPage('home');
                return prev;
            }
            const nextHistory = prev.slice(0, -1);
            setCurrentPage(nextHistory[nextHistory.length - 1]);
            return nextHistory;
        });
        setShowAI(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleShowAuth = () => setShowAuth(true);
    const dashboardForRole = (role) => ({
        agent: 'agent',
        landlord: 'landlord',
        tenant: 'tenant',
        investor: 'investor',
        'property-manager': 'landlord',
        professional: 'professionals',
        admin: 'admin',
    }[role] || 'dashboard');
    const noFooterPages = ['admin', 'agent', 'landlord', 'tenant', 'investor', 'dashboard'];
    const showFooter = !noFooterPages.includes(currentPage);
    return (<div className="flex flex-col min-h-screen">
      <Header user={user} currentPage={currentPage} navigate={navigate} onShowAuth={handleShowAuth} onSignOut={signOut} notifications={notifications}/>

      {currentPage !== 'home' && (
        <div className="sticky top-0 z-30 border-b border-[#E7E5E0] bg-[#FAFAF8]/95 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <button onClick={goBack} className="inline-flex items-center gap-2 rounded-xl border border-[#E7E5E0] bg-white px-3 py-2 text-sm font-semibold text-[#1C1917] shadow-sm transition hover:border-[#E85D04]/40 hover:text-[#E85D04]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 pb-16 lg:pb-0">
        {currentPage === 'home' && (<HomePage navigate={navigate} user={user} onShowAuth={handleShowAuth}/>)}
        {currentPage === 'about' && (<AboutPage navigate={navigate} onShowAuth={handleShowAuth}/>)}
        {currentPage === 'search' && (<SearchPage navigate={navigate} onShowAuth={handleShowAuth} initialListingFilter={searchFilter}/>)}
        {currentPage === 'property' && (<PropertyDetailPage navigate={navigate} propertyId={selectedPropertyId} user={user} onShowAuth={handleShowAuth}/>)}
        {currentPage === 'dashboard' && user && (<DashboardPage navigate={navigate} user={user}/>)}
        {currentPage === 'dashboard' && !user && (<div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#1C1917] mb-2">Sign in required</h2>
              <p className="text-[#78716C] mb-4">Please sign in to access your dashboard.</p>
              <button onClick={handleShowAuth} className="px-6 py-3 bg-[#E85D04] text-white font-semibold rounded-xl">Sign In</button>
            </div>
          </div>)}
        {currentPage === 'profile' && <ProfilePage navigate={navigate}/>}
        {currentPage === 'agent' && <AgentCRMPage navigate={navigate}/>}
        {currentPage === 'landlord' && <LandlordPage navigate={navigate}/>}
        {currentPage === 'tenant' && <TenantPage navigate={navigate}/>}
        {currentPage === 'investor' && <InvestorPage navigate={navigate}/>}
        {currentPage === 'agency' && <AgencyPage navigate={navigate}/>}
        {currentPage === 'admin' && <AdminPage navigate={navigate}/>}
        {currentPage === 'professionals' && <ProfessionalsPage navigate={navigate} onShowAuth={handleShowAuth}/>}
        {currentPage === 'newsroom' && <NewsroomPage navigate={navigate}/>}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'community' && <CommunityPage navigate={navigate}/>}
        {currentPage === 'financial-tools' && <FinancialToolsPage />}
        {currentPage === 'ai-assistant' && <AIAssistantPage navigate={navigate}/>}
        {currentPage === 'help' && <HelpPage navigate={navigate}/>}
        {currentPage === 'cart' && <CartPage navigate={navigate}/>}
        {currentPage === 'checkout' && <CheckoutPage navigate={navigate}/>}
        {currentPage === 'auth' && (<div className="flex items-center justify-center min-h-[60vh]">
            <button onClick={handleShowAuth} className="px-6 py-3 bg-[#E85D04] text-white font-semibold rounded-xl">Open Sign In</button>
          </div>)}
      </main>

      {showFooter && <Footer navigate={navigate}/>}
      <InstallPrompt />

      {/* Auth Modal */}
      {showAuth && (<AuthModal onClose={() => setShowAuth(false)} onSignIn={(u) => { signIn(u); setShowAuth(false); navigate(dashboardForRole(u.role)); }}/>)}

      {/* Floating AI Button */}
      <button onClick={() => setShowAI(!showAI)} aria-expanded={showAI} aria-label={showAI ? 'Close Ask STARA' : 'Open Ask STARA'} className="fixed bottom-[4.75rem] lg:bottom-6 right-4 lg:right-6 z-40 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }} title="Ask STARA">
        {showAI ? (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>) : (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>)}
      </button>

      {/* Floating AI Panel */}
      {showAI && (<AIAssistantPage navigate={navigate} onClose={() => setShowAI(false)} floating/>)}

    </div>);
}
