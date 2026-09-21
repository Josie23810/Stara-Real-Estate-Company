import { useState } from 'react';
import SubscriptionPlans from '../components/cart/SubscriptionPlans';
const LEADS = [
    { id: '1', name: 'David Mutua', phone: '+254 722 111 222', email: 'david.m@email.com', interest: '3BR Apartment, Westlands', budget: 'KES 90–120K/mo', stage: 'Viewing Scheduled', source: 'Website', date: '2026-09-12', priority: 'high' },
    { id: '2', name: 'Fatuma Aden', phone: '+254 733 444 555', email: 'fatuma.a@email.com', interest: '2BR, Kilimani', budget: 'KES 60–80K/mo', stage: 'Contacted', source: 'Referral', date: '2026-09-11', priority: 'medium' },
    { id: '3', name: 'Brian Omondi', phone: '+254 701 666 777', email: 'brian.o@email.com', interest: 'Land in Ruiru', budget: 'KES 5–15M', stage: 'Qualified', source: 'Social Media', date: '2026-09-10', priority: 'high' },
    { id: '4', name: 'Mary Njoki', phone: '+254 712 888 999', email: 'mary.n@email.com', interest: 'Villa Karen', budget: 'KES 40–60M', stage: 'Negotiation', source: 'Website', date: '2026-09-08', priority: 'high' },
    { id: '5', name: 'Ali Hassan', phone: '+254 745 000 111', email: 'ali.h@email.com', interest: 'Office space Upperhill', budget: 'KES 150–200K/mo', stage: 'New Lead', source: 'Google Ads', date: '2026-09-14', priority: 'medium' },
    { id: '6', name: 'Christine Wambui', phone: '+254 756 222 333', email: 'c.wambui@email.com', interest: '5BR house Muthaiga', budget: 'KES 60–90M', stage: 'Offer', source: 'Website', date: '2026-09-06', priority: 'high' },
];
const STAGES = ['New Lead', 'Contacted', 'Qualified', 'Viewing Scheduled', 'Viewing Completed', 'Negotiation', 'Offer', 'Closed', 'Lost'];
const STAGE_COLORS = {
    'New Lead': 'bg-gray-100 text-gray-700',
    'Contacted': 'bg-blue-100 text-blue-700',
    'Qualified': 'bg-purple-100 text-purple-700',
    'Viewing Scheduled': 'bg-yellow-100 text-yellow-700',
    'Viewing Completed': 'bg-orange-100 text-orange-700',
    'Negotiation': 'bg-[#FFF7F0] text-[#E85D04]',
    'Offer': 'bg-indigo-100 text-indigo-700',
    'Closed': 'bg-green-100 text-green-700',
    'Lost': 'bg-red-100 text-red-700',
};
const PERF_DATA = [75, 52, 88, 61, 94, 71, 85, 63, 90, 78, 82, 96];
export default function AgentCRMPage({ navigate }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [leadStage, setLeadStage] = useState(Object.fromEntries(LEADS.map(l => [l.id, l.stage])));
    const [selectedLead, setSelectedLead] = useState(null);
    const metrics = {
        totalLeads: LEADS.length,
        activeDeals: LEADS.filter(l => !['Closed', 'Lost'].includes(l.stage)).length,
        closedDeals: 8,
        revenue: 'KES 1.2M',
        conversionRate: '24%',
        viewingsThisMonth: 14,
    };
    return (<div className="bg-[#FAFAF8] min-h-screen">
      <div className="bg-[#1A2234] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <p className="text-[#8B949E] text-sm">Agent Dashboard</p>
            <h1 className="text-2xl font-bold mt-0.5">STARA Agent CRM</h1>
          </div>
          <button className="px-5 py-2.5 bg-[#E85D04] hover:bg-[#C54D03] text-white font-semibold rounded-xl text-sm transition-colors">
            + Add Lead
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 flex gap-1 overflow-x-auto pb-1">
          {['dashboard', 'leads', 'pipeline', 'calendar', 'listings', 'analytics'].map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white/20 text-white' : 'text-[#8B949E] hover:text-white'}`}>
              {tab}
            </button>))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'dashboard' && (<div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Leads', value: metrics.totalLeads, color: 'text-[#1C1917]' },
                { label: 'Active Deals', value: metrics.activeDeals, color: 'text-blue-600' },
                { label: 'Closed (MTD)', value: metrics.closedDeals, color: 'text-green-600' },
                { label: 'Revenue (MTD)', value: metrics.revenue, color: 'text-[#E85D04]' },
                { label: 'Conversion', value: metrics.conversionRate, color: 'text-purple-600' },
                { label: 'Viewings (MTD)', value: metrics.viewingsThisMonth, color: 'text-[#1C1917]' },
            ].map((kpi) => (<div key={kpi.label} className="bg-white rounded-2xl p-4 border border-[#E7E5E0]">
                  <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-xs text-[#78716C] mt-1">{kpi.label}</p>
                </div>))}
            </div>

            <SubscriptionPlans navigate={navigate}/>

            {/* Performance chart */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
              <h3 className="font-bold text-[#1C1917] mb-5">Lead Activity (Last 12 Months)</h3>
              <div className="flex items-end gap-2 h-32">
                {PERF_DATA.map((val, i) => (<div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-lg transition-all hover:opacity-80" style={{
                    height: `${(val / 100) * 128}px`,
                    background: i === 11 ? 'linear-gradient(135deg, #E85D04, #F4A100)' : '#F5F4F0',
                }}/>
                    <span className="text-[9px] text-[#A8A29E]">
                      {['O', 'N', 'D', 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S'][i]}
                    </span>
                  </div>))}
              </div>
            </div>

            {/* Recent leads */}
            <div className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden">
              <div className="p-5 border-b border-[#F5F4F0] flex items-center justify-between">
                <h3 className="font-bold text-[#1C1917]">Recent Leads</h3>
                <button onClick={() => setActiveTab('leads')} className="text-sm text-[#E85D04] font-semibold">View all</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#F5F4F0]">
                      {['Name', 'Interest', 'Budget', 'Stage', 'Source', 'Action'].map(h => (<th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#78716C] uppercase tracking-wider">{h}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {LEADS.slice(0, 4).map(lead => (<tr key={lead.id} className="border-b border-[#F5F4F0] last:border-0 hover:bg-[#FAFAF8]">
                        <td className="px-5 py-3">
                          <p className="font-semibold text-sm text-[#1C1917]">{lead.name}</p>
                          <p className="text-xs text-[#78716C]">{lead.phone}</p>
                        </td>
                        <td className="px-5 py-3 text-sm text-[#57534E]">{lead.interest}</td>
                        <td className="px-5 py-3 text-sm text-[#57534E]">{lead.budget}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${STAGE_COLORS[leadStage[lead.id]] || 'bg-gray-100 text-gray-700'}`}>
                            {leadStage[lead.id]}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-[#78716C]">{lead.source}</td>
                        <td className="px-5 py-3">
                          <button onClick={() => setSelectedLead(lead)} className="text-xs text-[#E85D04] font-semibold hover:underline">View</button>
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>)}

        {activeTab === 'leads' && (<div className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden">
            <div className="p-5 border-b border-[#F5F4F0] flex items-center justify-between">
              <h3 className="font-bold text-[#1C1917]">All Leads ({LEADS.length})</h3>
              <div className="flex gap-3">
                <select className="px-3 py-1.5 border border-[#E7E5E0] rounded-lg text-sm">
                  <option>All Stages</option>
                  {STAGES.map(s => <option key={s}>{s}</option>)}
                </select>
                <button className="px-4 py-1.5 bg-[#E85D04] text-white text-sm font-semibold rounded-lg">+ Add Lead</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F5F4F0] bg-[#FAFAF8]">
                    {['Lead', 'Interest', 'Budget', 'Stage', 'Priority', 'Source', 'Date', 'Actions'].map(h => (<th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#78716C] uppercase tracking-wider">{h}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {LEADS.map(lead => (<tr key={lead.id} className="border-b border-[#F5F4F0] last:border-0 hover:bg-[#FAFAF8]">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-sm text-[#1C1917]">{lead.name}</p>
                        <p className="text-xs text-[#78716C]">{lead.phone}</p>
                        <p className="text-xs text-[#78716C]">{lead.email}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#57534E] max-w-[150px]">{lead.interest}</td>
                      <td className="px-5 py-4 text-sm text-[#57534E] whitespace-nowrap">{lead.budget}</td>
                      <td className="px-5 py-4">
                        <select value={leadStage[lead.id]} onChange={e => setLeadStage(prev => ({ ...prev, [lead.id]: e.target.value }))} className="text-xs border border-[#E7E5E0] rounded-lg px-2 py-1 focus:outline-none focus:border-[#E85D04]">
                          {STAGES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${lead.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {lead.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#78716C]">{lead.source}</td>
                      <td className="px-5 py-4 text-xs text-[#78716C]">{lead.date}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => setSelectedLead(lead)} className="text-xs text-[#E85D04] font-semibold">View</button>
                          <button className="text-xs text-[#78716C]">Call</button>
                        </div>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>)}

        {activeTab === 'pipeline' && (<div>
            <h3 className="font-bold text-[#1C1917] mb-5">Sales Pipeline</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
              {['New Lead', 'Qualified', 'Viewing Scheduled', 'Negotiation', 'Offer'].map(stage => (<div key={stage} className="min-w-48">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">{stage}</p>
                    <span className="px-1.5 py-0.5 bg-[#F5F4F0] rounded text-xs font-bold text-[#78716C]">
                      {LEADS.filter(l => leadStage[l.id] === stage).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {LEADS.filter(l => leadStage[l.id] === stage).map(lead => (<div key={lead.id} className="pipeline-card bg-white rounded-xl p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedLead(lead)}>
                        <p className="font-semibold text-sm text-[#1C1917]">{lead.name}</p>
                        <p className="text-xs text-[#78716C] mt-0.5 line-clamp-1">{lead.interest}</p>
                        <p className="text-xs text-[#E85D04] font-medium mt-1">{lead.budget}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${lead.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{lead.priority}</span>
                          <span className="text-[10px] text-[#A8A29E]">{lead.source}</span>
                        </div>
                      </div>))}
                    {LEADS.filter(l => leadStage[l.id] === stage).length === 0 && (<div className="border-2 border-dashed border-[#E7E5E0] rounded-xl p-4 text-center">
                        <p className="text-xs text-[#A8A29E]">No leads in this stage</p>
                      </div>)}
                  </div>
                </div>))}
            </div>
          </div>)}

        {activeTab === 'calendar' && (<div className="bg-white rounded-2xl border border-[#E7E5E0] p-6">
            <h3 className="font-bold text-[#1C1917] mb-5">September 2026</h3>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (<p key={d} className="text-center text-xs font-semibold text-[#78716C] py-2">{d}</p>))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(30)].map((_, i) => {
                const day = i + 1;
                const hasEvent = [3, 8, 15, 20, 23].includes(day);
                const isToday = day === 15;
                return (<button key={day} className={`relative aspect-square rounded-xl flex items-center justify-center text-sm transition-colors ${isToday ? 'text-white font-bold' : 'text-[#57534E] hover:bg-[#F5F4F0]'}`} style={isToday ? { background: 'linear-gradient(135deg, #E85D04, #F4A100)' } : {}}>
                    {day}
                    {hasEvent && !isToday && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#E85D04] rounded-full"/>}
                  </button>);
            })}
            </div>
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-sm text-[#1C1917]">Upcoming Events</h4>
              {[
                { time: 'Today 11:00', title: 'Viewing – 3BR Westlands', client: 'David Mutua' },
                { time: 'Sep 20, 2:00 PM', title: 'Client meeting – Karen Villa', client: 'Mary Njoki' },
                { time: 'Sep 23, 10:00 AM', title: 'Viewing – Karen Villa', client: 'Brian Omondi' },
            ].map((event, i) => (<div key={i} className="flex gap-3 p-3 bg-[#F5F4F0] rounded-xl">
                  <div className="w-1 h-full min-h-[40px] bg-[#E85D04] rounded-full"/>
                  <div>
                    <p className="text-xs text-[#78716C]">{event.time}</p>
                    <p className="font-semibold text-sm text-[#1C1917]">{event.title}</p>
                    <p className="text-xs text-[#78716C]">{event.client}</p>
                  </div>
                </div>))}
            </div>
          </div>)}

        {activeTab === 'analytics' && (<div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Lead→Close', value: '24%', trend: '+3%' },
                { label: 'Avg. Deal Size', value: 'KES 28M', trend: '+12%' },
                { label: 'Avg. Days to Close', value: '42 days', trend: '-5 days' },
                { label: 'Client Satisfaction', value: '4.8/5', trend: '+0.2' },
            ].map(m => (<div key={m.label} className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
                  <p className="text-2xl font-bold text-[#1C1917]">{m.value}</p>
                  <p className="text-xs text-[#78716C] mt-1">{m.label}</p>
                  <p className="text-xs text-green-600 font-semibold mt-2">{m.trend} vs last month</p>
                </div>))}
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
              <h3 className="font-bold text-[#1C1917] mb-4">Lead Sources</h3>
              <div className="space-y-3">
                {[
                { source: 'Website', count: 28, pct: 40 },
                { source: 'Referral', count: 18, pct: 26 },
                { source: 'Social Media', count: 14, pct: 20 },
                { source: 'Google Ads', count: 10, pct: 14 },
            ].map(s => (<div key={s.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#57534E]">{s.source}</span>
                      <span className="font-semibold text-[#1C1917]">{s.count} leads ({s.pct}%)</span>
                    </div>
                    <div className="h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: 'linear-gradient(90deg, #E85D04, #F4A100)' }}/>
                    </div>
                  </div>))}
              </div>
            </div>
          </div>)}
      </div>

      {/* Lead detail modal */}
      {selectedLead && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget)
            setSelectedLead(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#1C1917] text-lg">{selectedLead.name}</h3>
              <button onClick={() => setSelectedLead(null)} className="p-1.5 rounded-lg hover:bg-[#F5F4F0] text-[#78716C]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Phone', value: selectedLead.phone },
                { label: 'Email', value: selectedLead.email },
                { label: 'Interest', value: selectedLead.interest },
                { label: 'Budget', value: selectedLead.budget },
                { label: 'Source', value: selectedLead.source },
                { label: 'Date Added', value: selectedLead.date },
            ].map(item => (<div key={item.label} className="flex justify-between py-2 border-b border-[#F5F4F0] last:border-0">
                  <span className="text-sm text-[#78716C]">{item.label}</span>
                  <span className="text-sm font-medium text-[#1C1917]">{item.value}</span>
                </div>))}
            </div>
            <div className="mt-5 flex gap-3">
              <button className="flex-1 py-2.5 bg-[#E85D04] text-white font-semibold rounded-xl text-sm">Call</button>
              <button className="flex-1 py-2.5 border border-[#E85D04] text-[#E85D04] font-semibold rounded-xl text-sm">Message</button>
              <button className="flex-1 py-2.5 border border-[#E7E5E0] text-[#57534E] font-semibold rounded-xl text-sm">Schedule</button>
            </div>
          </div>
        </div>)}
    </div>);
}
