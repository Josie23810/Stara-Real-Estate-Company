import { useState } from 'react';
import PromoCodeManager from '../components/admin/PromoCodeManager';
const PENDING_VERIFICATIONS = [
    { id: 'v1', type: 'Listing', title: '4BR Townhouse – Syokimau', submittedBy: 'Mary Achieng', date: '2026-09-12', docs: ['Title Deed', 'Agency License'] },
    { id: 'v2', type: 'Agent', title: 'Peter Odhiambo – Land Expert', submittedBy: 'Peter Odhiambo', date: '2026-09-11', docs: ['National ID', 'ESK Certificate'] },
    { id: 'v3', type: 'Listing', title: '2BR Apartment – Ngong Road', submittedBy: 'Daisy Muthoni', date: '2026-09-10', docs: ['Title Deed'] },
];
const RECENT_USERS = [
    { id: 'u1', name: 'David Mutua', role: 'buyer', email: 'd.mutua@email.com', joined: '2026-09-14', verified: false, status: 'active' },
    { id: 'u2', name: 'Grace Wanjiku', role: 'agent', email: 'grace@elite.co.ke', joined: '2026-09-12', verified: true, status: 'active' },
    { id: 'u3', name: 'Ali Hassan', role: 'landlord', email: 'ali.h@email.com', joined: '2026-09-10', verified: true, status: 'active' },
    { id: 'u4', name: 'Fatuma Aden', role: 'tenant', email: 'fatuma@email.com', joined: '2026-09-08', verified: false, status: 'suspended' },
];
const SYSTEM_ALERTS = [
    { id: 's1', type: 'fraud', title: 'Suspicious listing detected', body: 'Duplicate listing identified: 3BR Westlands appears twice', severity: 'high', time: '30 min ago' },
    { id: 's2', type: 'security', title: 'Multiple failed login attempts', body: 'User ali.h@email.com – 8 failed attempts from IP 41.x.x.x', severity: 'medium', time: '2h ago' },
    { id: 's3', type: 'system', title: 'Verification queue growing', body: '12 verifications pending. Average time: 18h.', severity: 'low', time: '4h ago' },
];
export default function AdminPage({ navigate }) {
    const [activeTab, setActiveTab] = useState('overview');
    return (<div className="bg-[#FAFAF8] min-h-screen">
      <div className="bg-[#1A2234] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <p className="text-[#8B949E] text-sm">STARA Administration</p>
            <h1 className="text-2xl font-bold mt-0.5">Admin Console</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#DC2626]/20 border border-[#DC2626]/40 rounded-xl">
            <div className="w-2 h-2 bg-[#DC2626] rounded-full animate-pulse"/>
            <span className="text-[#DC2626] text-xs font-semibold">Admin Access</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 flex gap-1 overflow-x-auto pb-1">
          {['overview', 'users', 'listings', 'verification', 'promo-codes', 'analytics', 'settings'].map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white/20 text-white' : 'text-[#8B949E] hover:text-white'}`}>
              {tab.replace('-', ' ')}
            </button>))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'overview' && (<>
            {/* System Alerts */}
            <div className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden">
              <div className="p-5 border-b border-[#F5F4F0] flex items-center justify-between">
                <h3 className="font-bold text-[#1C1917] flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#DC2626] rounded-full animate-pulse"/>
                  System Alerts
                </h3>
              </div>
              {SYSTEM_ALERTS.map(alert => (<div key={alert.id} className="flex gap-4 p-5 border-b border-[#F5F4F0] last:border-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${alert.severity === 'high' ? 'bg-red-100' : alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                    <span className="text-lg">{alert.type === 'fraud' ? '🚨' : alert.type === 'security' ? '🔐' : 'ℹ️'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[#1C1917]">{alert.title}</p>
                    <p className="text-sm text-[#57534E] mt-0.5">{alert.body}</p>
                    <p className="text-xs text-[#A8A29E] mt-1">{alert.time}</p>
                  </div>
                  <button className="text-sm text-[#E85D04] font-semibold">Review</button>
                </div>))}
            </div>

            {/* Platform KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: '84,230', trend: '+892 this week' },
                { label: 'Active Listings', value: '24,841', trend: '+186 today' },
                { label: 'Verified Listings', value: '18,403', trend: '74% verified' },
                { label: 'Revenue (MTD)', value: 'KES 3.2M', trend: '+18% vs last month' },
            ].map(kpi => (<div key={kpi.label} className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
                  <p className="text-2xl font-bold text-[#1C1917]">{kpi.value}</p>
                  <p className="text-xs text-[#78716C] mt-1">{kpi.label}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">{kpi.trend}</p>
                </div>))}
            </div>

            {/* Pending verifications */}
            <div className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden">
              <div className="p-5 border-b border-[#F5F4F0] flex items-center justify-between">
                <h3 className="font-bold text-[#1C1917]">Pending Verifications ({PENDING_VERIFICATIONS.length})</h3>
                <button onClick={() => setActiveTab('verification')} className="text-sm text-[#E85D04] font-semibold">View queue</button>
              </div>
              {PENDING_VERIFICATIONS.map(v => (<div key={v.id} className="p-5 border-b border-[#F5F4F0] last:border-0 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF7F0] flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{v.type === 'Agent' ? '👤' : '🏠'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[#1C1917]">{v.title}</p>
                    <p className="text-xs text-[#78716C]">{v.type} verification · Submitted by {v.submittedBy} · {v.date}</p>
                    <div className="flex gap-1 mt-1">
                      {v.docs.map(d => <span key={d} className="px-1.5 py-0.5 bg-[#F5F4F0] text-[10px] text-[#57534E] rounded">{d}</span>)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg">Approve</button>
                    <button className="px-3 py-1.5 border border-[#DC2626] text-[#DC2626] text-xs font-semibold rounded-lg">Reject</button>
                  </div>
                </div>))}
            </div>
          </>)}

        {activeTab === 'users' && (<div className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden">
            <div className="p-5 border-b border-[#F5F4F0] flex items-center justify-between">
              <h3 className="font-bold text-[#1C1917]">Users</h3>
              <div className="flex gap-3">
                <input placeholder="Search users..." className="px-3 py-1.5 border border-[#E7E5E0] rounded-lg text-sm focus:outline-none focus:border-[#E85D04]"/>
                <select className="px-3 py-1.5 border border-[#E7E5E0] rounded-lg text-sm">
                  <option>All Roles</option>
                  <option>Buyer</option>
                  <option>Agent</option>
                  <option>Landlord</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F5F4F0] bg-[#FAFAF8]">
                    {['User', 'Role', 'Email', 'Joined', 'Verified', 'Status', 'Actions'].map(h => (<th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#78716C] uppercase tracking-wider">{h}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_USERS.map(u => (<tr key={u.id} className="border-b border-[#F5F4F0] last:border-0 hover:bg-[#FAFAF8]">
                      <td className="px-5 py-4 font-semibold text-sm text-[#1C1917]">{u.name}</td>
                      <td className="px-5 py-4 text-sm capitalize text-[#57534E]">{u.role}</td>
                      <td className="px-5 py-4 text-sm text-[#57534E]">{u.email}</td>
                      <td className="px-5 py-4 text-sm text-[#78716C]">{u.joined}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${u.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {u.verified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button className="text-xs text-[#E85D04] font-semibold">View</button>
                          <button className="text-xs text-[#78716C]">{u.status === 'active' ? 'Suspend' : 'Restore'}</button>
                        </div>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>)}

        {activeTab === 'verification' && (<div className="space-y-4">
            {PENDING_VERIFICATIONS.map(v => (<div key={v.id} className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-[#FFF7F0] text-[#E85D04] text-xs font-semibold rounded-md">{v.type}</span>
                      <span className="text-xs text-[#78716C]">Submitted {v.date}</span>
                    </div>
                    <h3 className="font-bold text-[#1C1917] text-lg">{v.title}</h3>
                    <p className="text-sm text-[#78716C]">By: {v.submittedBy}</p>
                    <div className="flex gap-2 mt-3">
                      {v.docs.map(d => (<button key={d} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F4F0] rounded-lg text-xs font-medium text-[#57534E] hover:bg-[#E7E5E0]">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                          {d}
                        </button>))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl text-sm hover:bg-green-700">
                      ✓ Approve
                    </button>
                    <button className="px-5 py-2.5 border border-[#DC2626] text-[#DC2626] font-semibold rounded-xl text-sm hover:bg-red-50">
                      ✗ Reject
                    </button>
                    <button className="px-5 py-2.5 border border-[#E7E5E0] text-[#57534E] font-semibold rounded-xl text-sm hover:bg-[#F5F4F0]">
                      Request Info
                    </button>
                  </div>
                </div>
              </div>))}
          </div>)}

        {activeTab === 'promo-codes' && <PromoCodeManager />}

        {(activeTab === 'listings' || activeTab === 'analytics' || activeTab === 'settings') && (<div className="bg-white rounded-2xl p-12 border border-[#E7E5E0] text-center">
            <div className="w-20 h-20 bg-[#FFF7F0] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">{activeTab === 'listings' ? '🏠' : activeTab === 'analytics' ? '📊' : '⚙️'}</span>
            </div>
            <h3 className="font-bold text-[#1C1917] text-lg mb-2 capitalize">{activeTab}</h3>
            <p className="text-[#78716C] text-sm">This admin section is available in the full platform.</p>
          </div>)}
      </div>
    </div>);
}
