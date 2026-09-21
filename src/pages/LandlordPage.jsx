import { useState } from 'react';
const PROPERTIES_LL = [
    { id: 'l1', title: '3BR Apartment – Kilimani', tenant: 'David Mutua', rent: 95000, due: '2026-10-01', status: 'occupied', paid: true, unit: 'Apt 4B' },
    { id: 'l2', title: '2BR Apartment – Lavington', tenant: null, rent: 65000, due: null, status: 'vacant', paid: false, unit: 'Apt 2A' },
    { id: 'l3', title: '4BR House – Runda', tenant: 'Grace Otieno', rent: 180000, due: '2026-10-01', status: 'occupied', paid: false, unit: 'Full House' },
    { id: 'l4', title: 'Studio – Parklands', tenant: 'Ali Hassan', rent: 38000, due: '2026-09-25', status: 'occupied', paid: true, unit: 'Studio 7' },
];
const TENANTS = [
    { id: 't1', name: 'David Mutua', unit: 'Kilimani 4B', leaseEnd: '2027-03-31', rent: 95000, paid: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop' },
    { id: 't2', name: 'Grace Otieno', unit: 'Runda House', leaseEnd: '2026-12-31', rent: 180000, paid: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop' },
    { id: 't3', name: 'Ali Hassan', unit: 'Parklands Studio 7', leaseEnd: '2027-06-30', rent: 38000, paid: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop' },
];
const MAINTENANCE = [
    { id: 'm1', unit: 'Kilimani 4B', issue: 'Broken kitchen tap', priority: 'medium', status: 'in-progress', date: '2026-09-12', tenant: 'David Mutua' },
    { id: 'm2', unit: 'Runda House', issue: 'Air conditioner not cooling', priority: 'high', status: 'open', date: '2026-09-14', tenant: 'Grace Otieno' },
    { id: 'm3', unit: 'Parklands Studio 7', issue: 'Bathroom light fixture', priority: 'low', status: 'completed', date: '2026-09-08', tenant: 'Ali Hassan' },
];
export default function LandlordPage({ navigate }) {
    const [activeTab, setActiveTab] = useState('overview');
    const totalRent = PROPERTIES_LL.reduce((sum, p) => sum + p.rent, 0);
    const collected = PROPERTIES_LL.filter(p => p.paid).reduce((sum, p) => sum + p.rent, 0);
    const occupied = PROPERTIES_LL.filter(p => p.status === 'occupied').length;
    return (<div className="bg-[#FAFAF8] min-h-screen">
      <div className="bg-[#1A2234] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <p className="text-[#8B949E] text-sm">Property Owner</p>
            <h1 className="text-2xl font-bold mt-0.5">Landlord Dashboard</h1>
          </div>
          <button className="px-5 py-2.5 bg-[#E85D04] hover:bg-[#C54D03] text-white font-semibold rounded-xl text-sm transition-colors">
            + Add Property
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 flex gap-1 overflow-x-auto pb-1">
          {['overview', 'properties', 'tenants', 'rent', 'maintenance', 'analytics'].map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white/20 text-white' : 'text-[#8B949E] hover:text-white'}`}>
              {tab}
            </button>))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'overview' && (<>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Properties', value: PROPERTIES_LL.length, sub: `${occupied} occupied`, color: 'text-[#1C1917]' },
                { label: 'Monthly Rent Roll', value: `KES ${(totalRent / 1000).toFixed(0)}K`, sub: 'Expected', color: 'text-[#E85D04]' },
                { label: 'Rent Collected', value: `KES ${(collected / 1000).toFixed(0)}K`, sub: 'This month', color: 'text-green-600' },
                { label: 'Outstanding', value: `KES ${((totalRent - collected) / 1000).toFixed(0)}K`, sub: 'Pending', color: 'text-[#DC2626]' },
            ].map(kpi => (<div key={kpi.label} className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
                  <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-xs text-[#78716C] mt-1">{kpi.label}</p>
                  <p className="text-xs text-[#A8A29E] mt-0.5">{kpi.sub}</p>
                </div>))}
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
                <h3 className="font-bold text-[#1C1917] mb-4">Rent Collection</h3>
                <div className="space-y-3">
                  {PROPERTIES_LL.map(p => (<div key={p.id} className="flex items-center justify-between py-2 border-b border-[#F5F4F0] last:border-0">
                      <div>
                        <p className="font-medium text-sm text-[#1C1917]">{p.title}</p>
                        <p className="text-xs text-[#78716C]">{p.tenant || 'Vacant'} · {p.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-[#1C1917]">KES {p.rent.toLocaleString()}</p>
                        <span className={`text-xs font-semibold ${p.paid ? 'text-green-600' : p.status === 'vacant' ? 'text-[#78716C]' : 'text-[#DC2626]'}`}>
                          {p.paid ? '✓ Paid' : p.status === 'vacant' ? 'Vacant' : 'Unpaid'}
                        </span>
                      </div>
                    </div>))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
                <h3 className="font-bold text-[#1C1917] mb-4">Maintenance Requests</h3>
                {MAINTENANCE.map(req => (<div key={req.id} className="flex items-start gap-3 py-3 border-b border-[#F5F4F0] last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${req.priority === 'high' ? 'bg-[#DC2626]' : req.priority === 'medium' ? 'bg-[#D97706]' : 'bg-green-500'}`}/>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-[#1C1917]">{req.issue}</p>
                      <p className="text-xs text-[#78716C]">{req.unit} · {req.tenant}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${req.status === 'completed' ? 'bg-green-100 text-green-700' : req.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                      {req.status}
                    </span>
                  </div>))}
                <button onClick={() => setActiveTab('maintenance')} className="mt-3 text-sm text-[#E85D04] font-semibold">View all →</button>
              </div>
            </div>
          </>)}

        {activeTab === 'properties' && (<div className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden">
            <div className="p-5 border-b border-[#F5F4F0] flex items-center justify-between">
              <h3 className="font-bold text-[#1C1917]">My Properties ({PROPERTIES_LL.length})</h3>
              <button className="px-4 py-2 bg-[#E85D04] text-white font-semibold rounded-xl text-sm">+ Add Property</button>
            </div>
            <div className="divide-y divide-[#F5F4F0]">
              {PROPERTIES_LL.map(p => (<div key={p.id} className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#1C1917]">{p.title}</p>
                    <p className="text-sm text-[#78716C] mt-0.5">{p.unit} · {p.tenant || 'Vacant'}</p>
                    <p className="text-sm font-semibold text-[#E85D04] mt-1">KES {p.rent.toLocaleString()}/mo</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status === 'occupied' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
                    <button className="text-sm text-[#E85D04] font-semibold">Edit</button>
                  </div>
                </div>))}
            </div>
          </div>)}

        {activeTab === 'tenants' && (<div className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden">
            <div className="p-5 border-b border-[#F5F4F0]">
              <h3 className="font-bold text-[#1C1917]">Tenants ({TENANTS.length})</h3>
            </div>
            <div className="divide-y divide-[#F5F4F0]">
              {TENANTS.map(t => (<div key={t.id} className="p-5 flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"/>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1C1917]">{t.name}</p>
                    <p className="text-sm text-[#78716C]">{t.unit}</p>
                    <p className="text-xs text-[#A8A29E] mt-0.5">Lease ends {new Date(t.leaseEnd).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-[#1C1917]">KES {t.rent.toLocaleString()}/mo</p>
                    <span className={`text-xs font-semibold ${t.paid ? 'text-green-600' : 'text-[#DC2626]'}`}>{t.paid ? '✓ Paid' : '⚠ Overdue'}</span>
                  </div>
                  <button className="text-sm text-[#E85D04] font-semibold ml-4">View</button>
                </div>))}
            </div>
          </div>)}

        {activeTab === 'maintenance' && (<div className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden">
            <div className="p-5 border-b border-[#F5F4F0] flex items-center justify-between">
              <h3 className="font-bold text-[#1C1917]">Maintenance Requests</h3>
              <button className="px-4 py-2 border border-[#E85D04] text-[#E85D04] font-semibold rounded-xl text-sm">Log Request</button>
            </div>
            <div className="divide-y divide-[#F5F4F0]">
              {MAINTENANCE.map(req => (<div key={req.id} className="p-5 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${req.priority === 'high' ? 'bg-red-100' : req.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                    <span className="text-lg">{req.priority === 'high' ? '🔴' : req.priority === 'medium' ? '🟡' : '🟢'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1C1917]">{req.issue}</p>
                    <p className="text-sm text-[#78716C]">{req.unit} · Reported by {req.tenant}</p>
                    <p className="text-xs text-[#A8A29E] mt-0.5">{req.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${req.status === 'completed' ? 'bg-green-100 text-green-700' : req.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>{req.status}</span>
                    {req.status !== 'completed' && <button className="text-sm text-[#E85D04] font-semibold">Assign</button>}
                  </div>
                </div>))}
            </div>
          </div>)}

        {activeTab === 'rent' && (<div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
              <h3 className="font-bold text-[#1C1917] mb-4">September 2026 Rent Collection</h3>
              <div className="space-y-3">
                {PROPERTIES_LL.map(p => (<div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-[#F5F4F0]">
                    <div>
                      <p className="font-semibold text-sm text-[#1C1917]">{p.title}</p>
                      <p className="text-xs text-[#78716C]">{p.tenant || 'Vacant'} · Due {p.due || '—'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-[#1C1917]">KES {p.rent.toLocaleString()}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.paid ? 'bg-green-100 text-green-700' : p.status === 'vacant' ? 'bg-[#F5F4F0] text-[#78716C]' : 'bg-red-100 text-red-700'}`}>
                        {p.paid ? 'Paid' : p.status === 'vacant' ? 'Vacant' : 'Unpaid'}
                      </span>
                      {!p.paid && p.status === 'occupied' && (<button className="text-xs text-[#E85D04] font-semibold border border-[#E85D04] px-3 py-1 rounded-lg hover:bg-[#FFF7F0]">Send Reminder</button>)}
                    </div>
                  </div>))}
              </div>
            </div>
          </div>)}

        {activeTab === 'analytics' && (<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
                { title: 'Occupancy Rate', value: `${Math.round((occupied / PROPERTIES_LL.length) * 100)}%`, desc: `${occupied}/${PROPERTIES_LL.length} units occupied` },
                { title: 'Annual Rent Income', value: `KES ${((totalRent * 12) / 1000000).toFixed(1)}M`, desc: 'Projected (based on current rents)' },
                { title: 'Avg. Rent per Unit', value: `KES ${Math.round(totalRent / PROPERTIES_LL.length).toLocaleString()}`, desc: 'Per occupied unit' },
                { title: 'Maintenance Spend (MTD)', value: 'KES 45,000', desc: 'Across all properties' },
            ].map(kpi => (<div key={kpi.title} className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
                <p className="text-3xl font-bold text-[#E85D04]">{kpi.value}</p>
                <p className="font-semibold text-[#1C1917] mt-2">{kpi.title}</p>
                <p className="text-sm text-[#78716C] mt-0.5">{kpi.desc}</p>
              </div>))}
          </div>)}
      </div>
    </div>);
}
