import { useState } from 'react';
export default function TenantPage({ navigate }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [maintForm, setMaintForm] = useState({ issue: '', priority: 'medium', description: '' });
    const [maintSent, setMaintSent] = useState(false);
    const lease = {
        property: '3BR Apartment – Westlands',
        address: 'Westlands Road, Nairobi',
        landlord: 'James Kimani',
        start: '2026-04-01',
        end: '2027-03-31',
        rent: 95000,
        deposit: 190000,
        nextDue: '2026-10-01',
    };
    const payments = [
        { id: 'p1', month: 'September 2026', amount: 95000, date: '2026-09-01', status: 'paid', ref: 'STW-SEP26-001' },
        { id: 'p2', month: 'August 2026', amount: 95000, date: '2026-08-01', status: 'paid', ref: 'STW-AUG26-001' },
        { id: 'p3', month: 'July 2026', amount: 95000, date: '2026-07-01', status: 'paid', ref: 'STW-JUL26-001' },
    ];
    const maintenanceHistory = [
        { id: 'm1', issue: 'Leaking tap – kitchen', status: 'resolved', date: '2026-08-15' },
        { id: 'm2', issue: 'Broken bedroom door handle', status: 'in-progress', date: '2026-09-10' },
    ];
    const handleMaintSubmit = async () => {
        await new Promise(r => setTimeout(r, 800));
        setMaintSent(true);
        setTimeout(() => setMaintSent(false), 3000);
        setMaintForm({ issue: '', priority: 'medium', description: '' });
    };
    return (<div className="bg-[#FAFAF8] min-h-screen">
      <div className="bg-[#1A2234] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <p className="text-[#8B949E] text-sm">Tenant Portal</p>
            <h1 className="text-2xl font-bold mt-0.5">My Rental</h1>
          </div>
          <button onClick={() => navigate('search')} className="px-5 py-2.5 bg-[#E85D04] text-white font-semibold rounded-xl text-sm">
            Find New Property
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 flex gap-1 overflow-x-auto pb-1">
          {['overview', 'lease', 'payments', 'maintenance', 'messages'].map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white/20 text-white' : 'text-[#8B949E] hover:text-white'}`}>
              {tab}
            </button>))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {activeTab === 'overview' && (<>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Monthly Rent', value: 'KES 95,000', sub: 'Due Oct 1', color: 'text-[#E85D04]' },
                { label: 'Lease Ends', value: 'Mar 2027', sub: '6 months left', color: 'text-blue-600' },
                { label: 'Security Deposit', value: 'KES 190,000', sub: 'Held by landlord', color: 'text-[#1C1917]' },
                { label: 'Open Requests', value: '1', sub: 'Maintenance', color: 'text-yellow-600' },
            ].map(kpi => (<div key={kpi.label} className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
                  <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-xs text-[#78716C] mt-1">{kpi.label}</p>
                  <p className="text-xs text-[#A8A29E] mt-0.5">{kpi.sub}</p>
                </div>))}
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
              <h3 className="font-bold text-[#1C1917] mb-4">Current Property</h3>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=200&fit=crop" alt="property" className="w-full h-full object-cover"/>
                </div>
                <div>
                  <p className="font-bold text-[#1C1917]">{lease.property}</p>
                  <p className="text-sm text-[#78716C] mt-0.5">{lease.address}</p>
                  <p className="text-sm text-[#57534E] mt-1">Landlord: {lease.landlord}</p>
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => setActiveTab('lease')} className="px-3 py-1.5 text-xs font-semibold text-[#E85D04] border border-[#E85D04] rounded-lg hover:bg-[#FFF7F0]">View Lease</button>
                    <button onClick={() => setActiveTab('maintenance')} className="px-3 py-1.5 text-xs font-semibold text-[#57534E] border border-[#E7E5E0] rounded-lg hover:bg-[#F5F4F0]">Report Issue</button>
                  </div>
                </div>
              </div>
            </div>
          </>)}

        {activeTab === 'lease' && (<div className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#1C1917] text-lg">Lease Agreement</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Active</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Property', value: lease.property },
                { label: 'Address', value: lease.address },
                { label: 'Landlord', value: lease.landlord },
                { label: 'Lease Start', value: new Date(lease.start).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Lease End', value: new Date(lease.end).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Monthly Rent', value: `KES ${lease.rent.toLocaleString()}` },
                { label: 'Security Deposit', value: `KES ${lease.deposit.toLocaleString()}` },
                { label: 'Next Payment Due', value: new Date(lease.nextDue).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) },
            ].map(item => (<div key={item.label} className="p-4 bg-[#F5F4F0] rounded-xl">
                  <p className="text-xs text-[#78716C] mb-0.5">{item.label}</p>
                  <p className="font-semibold text-sm text-[#1C1917]">{item.value}</p>
                </div>))}
            </div>
            <div className="mt-5 flex gap-3">
              <button className="px-5 py-2.5 bg-[#E85D04] text-white font-semibold rounded-xl text-sm">Download Lease PDF</button>
              <button className="px-5 py-2.5 border border-[#E7E5E0] text-[#57534E] font-semibold rounded-xl text-sm">Move-in Checklist</button>
            </div>
          </div>)}

        {activeTab === 'payments' && (<div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1C1917]">Payment History</h3>
                <button className="text-sm text-[#E85D04] font-semibold">Download Statement</button>
              </div>
              <div className="space-y-3">
                {payments.map(p => (<div key={p.id} className="flex items-center justify-between p-4 bg-[#F5F4F0] rounded-xl">
                    <div>
                      <p className="font-semibold text-sm text-[#1C1917]">{p.month}</p>
                      <p className="text-xs text-[#78716C]">Ref: {p.ref} · {p.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1C1917]">KES {p.amount.toLocaleString()}</p>
                      <span className="text-xs font-semibold text-green-600">✓ Paid</span>
                    </div>
                  </div>))}
              </div>
            </div>
          </div>)}

        {activeTab === 'maintenance' && (<div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
              <h3 className="font-bold text-[#1C1917] mb-4">Report Maintenance Issue</h3>
              {maintSent ? (<div className="text-center py-8">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <p className="font-semibold text-[#1C1917]">Request submitted!</p>
                  <p className="text-sm text-[#78716C]">Your landlord has been notified.</p>
                </div>) : (<div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Issue Title</label>
                    <input value={maintForm.issue} onChange={e => setMaintForm({ ...maintForm, issue: e.target.value })} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]" placeholder="e.g. Leaking tap in bathroom"/>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Priority</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['low', 'medium', 'high'].map(p => (<button key={p} onClick={() => setMaintForm({ ...maintForm, priority: p })} className={`py-2 rounded-lg border-2 text-xs font-semibold capitalize transition-all ${maintForm.priority === p ? 'border-[#E85D04] text-[#E85D04] bg-[#FFF7F0]' : 'border-[#E7E5E0] text-[#57534E]'}`}>
                          {p}
                        </button>))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Description</label>
                    <textarea value={maintForm.description} onChange={e => setMaintForm({ ...maintForm, description: e.target.value })} rows={4} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] resize-none" placeholder="Describe the issue in detail..."/>
                  </div>
                  <button onClick={handleMaintSubmit} className="w-full py-3 font-bold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                    Submit Request
                  </button>
                </div>)}
            </div>
            <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
              <h3 className="font-bold text-[#1C1917] mb-4">Request History</h3>
              {maintenanceHistory.map(req => (<div key={req.id} className="flex items-center gap-3 py-3 border-b border-[#F5F4F0] last:border-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${req.status === 'resolved' ? 'bg-green-500' : 'bg-yellow-500'}`}/>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[#1C1917]">{req.issue}</p>
                    <p className="text-xs text-[#78716C]">{req.date}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${req.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{req.status}</span>
                </div>))}
            </div>
          </div>)}

        {activeTab === 'messages' && (<div className="bg-white rounded-2xl p-12 border border-[#E7E5E0] text-center">
            <span className="text-4xl block mb-4">💬</span>
            <h3 className="font-bold text-[#1C1917]">Messages</h3>
            <p className="text-sm text-[#78716C] mt-2">Message your landlord securely through STARA.</p>
            <button className="mt-4 px-6 py-3 bg-[#E85D04] text-white font-semibold rounded-xl text-sm">Message Landlord</button>
          </div>)}
      </div>
    </div>);
}
