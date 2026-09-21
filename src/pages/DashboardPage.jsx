import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { PROPERTIES } from '../data/mockData';
import PropertyCard from '../components/PropertyCard';
const NOTIFICATIONS = [
    { id: '1', type: 'price_drop', title: 'Price Drop Alert', body: '3BR Westlands dropped from KES 110,000 to KES 95,000/mo', time: '2h ago', unread: true },
    { id: '2', type: 'new_listing', title: 'New Match', body: 'A new 2BR in Kilimani matches your saved search', time: '4h ago', unread: true },
    { id: '3', type: 'viewing', title: 'Viewing Reminder', body: 'Viewing at Karen Villa tomorrow at 11:00 AM', time: '1d ago', unread: true },
    { id: '4', type: 'message', title: 'New Message', body: 'James Kimani replied to your inquiry', time: '1d ago', unread: false },
    { id: '5', type: 'system', title: 'Verification Complete', body: 'Your account identity verification is complete', time: '3d ago', unread: false },
];
const MESSAGES = [
    { id: '1', from: 'James Kimani', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop', message: 'Hello! Yes, the property is still available. Would you like to schedule a viewing this week?', time: '2h ago', unread: true, property: '3BR Westlands' },
    { id: '2', from: 'Grace Wanjiku', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop', message: 'The Karen Villa is available for viewing on Saturday morning. Please confirm your preferred time.', time: '1d ago', unread: false, property: 'Karen Villa' },
];
const VIEWINGS = [
    { id: '1', property: '3BR Modern Apartment – Westlands', date: '2026-09-20', time: '11:00 AM', type: 'in-person', status: 'confirmed', agent: 'James Kimani' },
    { id: '2', property: '5BR Villa with Pool – Karen', date: '2026-09-23', time: '2:00 PM', type: 'in-person', status: 'pending', agent: 'Grace Wanjiku' },
];
export default function DashboardPage({ navigate, user }) {
    const { profileCompletion } = useUser();
    const [activeTab, setActiveTab] = useState('overview');
    const [newMessage, setNewMessage] = useState('');
    const [activeConversation, setActiveConversation] = useState('1');
    const savedProperties = PROPERTIES.slice(0, 4);
    return (<div className="bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1917]">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-[#78716C] text-sm mt-0.5 capitalize">
              {user.role} Account
              {user.verified && <span className="ml-2 inline-flex items-center gap-1 text-green-600 font-semibold"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>Verified</span>}
            </p>
          </div>
          {profileCompletion < 100 && (<div className="mb-6 rounded-2xl border border-[#F4A100]/30 bg-[#FFF7F0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-[#1C1917]">Your profile is {profileCompletion}% complete</p>
              <p className="text-xs text-[#78716C] mt-1">Complete your profile to receive better property matches and build trust with other STARA users.</p>
            </div>
            <button onClick={() => navigate('profile')} className="shrink-0 rounded-xl bg-[#E85D04] px-4 py-2.5 text-sm font-semibold text-white">Complete profile</button>
          </div>)}
          <div className="flex gap-3">
            <button onClick={() => navigate('search')} className="px-4 py-2 text-sm font-semibold text-[#E85D04] border border-[#E85D04] rounded-xl hover:bg-[#FFF7F0] transition-colors">
              Browse Properties
            </button>
            {user.role === 'landlord' && (<button onClick={() => navigate('landlord')} className="px-4 py-2 text-sm font-semibold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                Landlord Dashboard
              </button>)}
            {user.role === 'agent' && (<button onClick={() => navigate('agent')} className="px-4 py-2 text-sm font-semibold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                Agent CRM
              </button>)}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Profile card */}
            <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0] mb-5">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover"/>
                  {user.verified && (<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    </div>)}
                </div>
                <p className="font-bold text-[#1C1917]">{user.name}</p>
                <p className="text-sm text-[#78716C] capitalize">{user.role}</p>
                {user.trustScore && (<div className="mt-3 w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#78716C]">Trust Score</span>
                      <span className="font-bold text-[#E85D04]">{user.trustScore}/100</span>
                    </div>
                    <div className="h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#E85D04] to-[#F4A100]" style={{ width: `${user.trustScore}%` }}/>
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Nav */}
            <nav className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden">
              {[
            { tab: 'overview', label: 'Overview', icon: '⊞' },
            { tab: 'saved', label: 'Saved Properties', icon: '♡' },
            { tab: 'messages', label: 'Messages', badge: 1 },
            { tab: 'viewings', label: 'Viewings', icon: '📅' },
            { tab: 'notifications', label: 'Notifications', badge: 3 },
            { tab: 'settings', label: 'Settings', icon: '⚙' },
        ].map((item) => (<button key={item.tab} onClick={() => setActiveTab(item.tab)} className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors border-b border-[#F5F4F0] last:border-0 ${activeTab === item.tab ? 'bg-[#FFF7F0] text-[#E85D04] font-semibold' : 'text-[#57534E] hover:bg-[#F5F4F0]'}`}>
                  <span className="flex items-center gap-2">
                    {item.icon && <span>{item.icon}</span>}
                    {item.label}
                  </span>
                  {item.badge && (<span className="w-5 h-5 bg-[#E85D04] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>)}
                </button>))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3 space-y-5">
            {activeTab === 'overview' && (<>
                {/* KPI cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                { label: 'Saved Properties', value: '12', icon: '♡', color: 'text-[#E85D04]' },
                { label: 'Active Viewings', value: '2', icon: '📅', color: 'text-blue-600' },
                { label: 'Unread Messages', value: '1', icon: '💬', color: 'text-purple-600' },
                { label: 'Saved Searches', value: '3', icon: '🔍', color: 'text-green-600' },
            ].map((kpi) => (<div key={kpi.label} className="bg-white rounded-2xl p-4 border border-[#E7E5E0]">
                      <span className="text-2xl">{kpi.icon}</span>
                      <p className={`text-2xl font-bold mt-2 ${kpi.color}`}>{kpi.value}</p>
                      <p className="text-xs text-[#78716C] mt-0.5">{kpi.label}</p>
                    </div>))}
                </div>

                {/* Recent properties */}
                <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
                  <h3 className="font-bold text-[#1C1917] mb-4">Recommended For You</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PROPERTIES.slice(0, 2).map(p => (<PropertyCard key={p.id} property={p} navigate={navigate} compact/>))}
                  </div>
                </div>

                {/* Upcoming viewings */}
                <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
                  <h3 className="font-bold text-[#1C1917] mb-4">Upcoming Viewings</h3>
                  {VIEWINGS.map(v => (<div key={v.id} className="flex items-center gap-4 py-3 border-b border-[#F5F4F0] last:border-0">
                      <div className="w-12 h-12 rounded-xl bg-[#FFF7F0] flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] text-[#E85D04] font-bold uppercase">{new Date(v.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-lg font-bold text-[#E85D04] leading-none">{new Date(v.date).getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#1C1917] truncate">{v.property}</p>
                        <p className="text-xs text-[#78716C]">{v.time} · {v.type} · {v.agent}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${v.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {v.status}
                      </span>
                    </div>))}
                </div>
              </>)}

            {activeTab === 'saved' && (<div className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
                <h3 className="font-bold text-[#1C1917] mb-4">Saved Properties ({savedProperties.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedProperties.map(p => <PropertyCard key={p.id} property={p} navigate={navigate} saved/>)}
                </div>
              </div>)}

            {activeTab === 'messages' && (<div className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden h-[500px] flex">
                <div className="w-64 border-r border-[#F5F4F0] flex flex-col">
                  <div className="p-4 border-b border-[#F5F4F0]">
                    <h3 className="font-bold text-[#1C1917] text-sm">Messages</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {MESSAGES.map(m => (<button key={m.id} onClick={() => setActiveConversation(m.id)} className={`w-full p-4 flex gap-3 border-b border-[#F5F4F0] text-left hover:bg-[#F5F4F0] transition-colors ${activeConversation === m.id ? 'bg-[#FFF7F0]' : ''}`}>
                        <img src={m.avatar} alt={m.from} className="w-10 h-10 rounded-xl object-cover flex-shrink-0"/>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p className="text-sm font-semibold text-[#1C1917] truncate">{m.from}</p>
                            {m.unread && <div className="w-2 h-2 rounded-full bg-[#E85D04] flex-shrink-0 mt-1"/>}
                          </div>
                          <p className="text-xs text-[#78716C] truncate">{m.message}</p>
                          <p className="text-[10px] text-[#A8A29E] mt-0.5">{m.time}</p>
                        </div>
                      </button>))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  {(() => {
                const conv = MESSAGES.find(m => m.id === activeConversation);
                if (!conv)
                    return null;
                return (<>
                        <div className="p-4 border-b border-[#F5F4F0] flex items-center gap-3">
                          <img src={conv.avatar} alt={conv.from} className="w-9 h-9 rounded-xl object-cover"/>
                          <div>
                            <p className="font-semibold text-sm text-[#1C1917]">{conv.from}</p>
                            <p className="text-xs text-[#78716C]">Re: {conv.property}</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          <div className="flex justify-end">
                            <div className="bg-[#E85D04] text-white rounded-2xl rounded-tr-md px-4 py-2.5 max-w-xs text-sm">
                              Hi, I am interested in your listing. Is it still available?
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <img src={conv.avatar} alt="" className="w-7 h-7 rounded-lg object-cover flex-shrink-0"/>
                            <div className="bg-[#F5F4F0] rounded-2xl rounded-tl-md px-4 py-2.5 max-w-xs text-sm text-[#1C1917]">
                              {conv.message}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border-t border-[#F5F4F0] flex gap-2">
                          <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]"/>
                          <button onClick={() => setNewMessage('')} className="px-4 py-2.5 bg-[#E85D04] text-white rounded-xl text-sm font-semibold hover:bg-[#C54D03] transition-colors">Send</button>
                        </div>
                      </>);
            })()}
                </div>
              </div>)}

            {activeTab === 'notifications' && (<div className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden">
                <div className="p-5 border-b border-[#F5F4F0] flex items-center justify-between">
                  <h3 className="font-bold text-[#1C1917]">Notifications</h3>
                  <button className="text-sm text-[#E85D04] font-semibold">Mark all read</button>
                </div>
                {NOTIFICATIONS.map(n => (<div key={n.id} className={`flex gap-4 p-5 border-b border-[#F5F4F0] last:border-0 ${n.unread ? 'bg-[#FFF7F0]' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === 'price_drop' ? 'bg-green-100' : n.type === 'viewing' ? 'bg-blue-100' : n.type === 'message' ? 'bg-purple-100' : 'bg-[#FFF7F0]'}`}>
                      <span className="text-lg">
                        {n.type === 'price_drop' ? '📉' : n.type === 'new_listing' ? '🏠' : n.type === 'viewing' ? '📅' : n.type === 'message' ? '💬' : '🔔'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-[#1C1917]">{n.title}</p>
                        {n.unread && <span className="w-2 h-2 rounded-full bg-[#E85D04]"/>}
                      </div>
                      <p className="text-sm text-[#57534E] mt-0.5">{n.body}</p>
                      <p className="text-xs text-[#A8A29E] mt-1">{n.time}</p>
                    </div>
                  </div>))}
              </div>)}

            {activeTab === 'viewings' && (<div className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden">
                <div className="p-5 border-b border-[#F5F4F0]">
                  <h3 className="font-bold text-[#1C1917]">My Viewings</h3>
                </div>
                {VIEWINGS.map(v => (<div key={v.id} className="p-5 border-b border-[#F5F4F0] last:border-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#1C1917]">{v.property}</p>
                        <p className="text-sm text-[#78716C] mt-1">📅 {new Date(v.date).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' })} at {v.time}</p>
                        <p className="text-sm text-[#78716C]">Agent: {v.agent} · {v.type}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${v.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {v.status}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-xs text-[#78716C] hover:text-[#E85D04] transition-colors">Reschedule</button>
                          <button className="text-xs text-[#DC2626]">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>))}
                <div className="p-5">
                  <button onClick={() => navigate('search')} className="text-sm font-semibold text-[#E85D04] hover:underline">
                    + Browse more properties to view
                  </button>
                </div>
              </div>)}

            {activeTab === 'settings' && (<div className="space-y-5">
                {[
                { title: 'Personal Information', fields: ['Full Name', 'Email', 'Phone', 'Location', 'Bio'] },
                { title: 'Notification Preferences', fields: ['New matching listings', 'Price drops', 'Viewing reminders', 'Messages', 'Rent reminders'] },
            ].map((section) => (<div key={section.title} className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
                    <h3 className="font-bold text-[#1C1917] mb-4">{section.title}</h3>
                    <div className="space-y-3">
                      {section.fields.map(field => (<div key={field} className="flex items-center justify-between py-2 border-b border-[#F5F4F0] last:border-0">
                          <span className="text-sm text-[#57534E]">{field}</span>
                          {section.title === 'Notification Preferences' ? (<button className="w-10 h-5 bg-[#E85D04] rounded-full relative">
                              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"/>
                            </button>) : (<button className="text-xs text-[#E85D04] font-semibold">Edit</button>)}
                        </div>))}
                    </div>
                  </div>))}
              </div>)}
          </main>
        </div>
      </div>
    </div>);
}
