import { useState } from 'react';
import { PROFESSIONALS } from '../data/mockData';
const PROFESSIONS = ['All', 'Real Estate Lawyer', 'Property Valuer', 'Architect', 'Moving Company', 'Surveyor', 'Interior Designer', 'Contractor', 'Mortgage Broker', 'Insurance'];
const MORE_PROS = [
    { id: 'p5', name: 'Wanjiku Surveyors', profession: 'Surveyor', location: 'Nairobi', rating: 4.7, reviews: 55, verified: true, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', services: ['Land Survey', 'Boundary Survey', 'Topographic Survey', 'Report'], description: 'ISK registered surveyors with 15 years of experience across all Kenyan counties.' },
    { id: 'p6', name: 'HomeStyle Interiors', profession: 'Interior Designer', location: 'Westlands, Nairobi', rating: 4.9, reviews: 38, verified: true, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', services: ['Residential Design', 'Office Design', 'Furniture Sourcing', '3D Visualization'], description: 'Award-winning interior design studio transforming Kenyan homes and offices.' },
    { id: 'p7', name: 'Safaricom Mortgage', profession: 'Mortgage Broker', location: 'CBD, Nairobi', rating: 4.6, reviews: 112, verified: false, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', services: ['Home Loans', 'Refinancing', 'Pre-approval', 'Investment Mortgages'], description: 'Access the best mortgage rates from Kenya\'s top banks. Free comparison service.' },
    { id: 'p8', name: 'Imara Insurance', profession: 'Insurance', location: 'Upperhill, Nairobi', rating: 4.4, reviews: 77, verified: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', services: ['Property Insurance', 'Landlord Cover', 'Tenant\'s Insurance', 'Commercial Cover'], description: 'Comprehensive property insurance solutions for homeowners, landlords and tenants.' },
];
const ALL_PROS = [...PROFESSIONALS, ...MORE_PROS];
export default function ProfessionalsPage({ navigate, onShowAuth }) {
    const [selectedProfession, setSelectedProfession] = useState('All');
    const [searchQ, setSearchQ] = useState('');
    const [requestModal, setRequestModal] = useState(null);
    const [requestSent, setRequestSent] = useState(false);
    const filtered = ALL_PROS.filter(p => {
        const matchesProfession = selectedProfession === 'All' || p.profession === selectedProfession;
        const matchesSearch = !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.profession.toLowerCase().includes(searchQ.toLowerCase());
        return matchesProfession && matchesSearch;
    });
    const handleRequest = async () => {
        await new Promise(r => setTimeout(r, 800));
        setRequestSent(true);
        setTimeout(() => { setRequestModal(null); setRequestSent(false); }, 2000);
    };
    return (<div className="bg-[#FAFAF8] min-h-screen">
      {/* Hero */}
      <div className="bg-[#1A2234] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#F4A100] text-sm font-semibold uppercase tracking-widest mb-3">Verified Experts</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Professional Marketplace</h1>
          <p className="text-[#8B949E] text-base max-w-xl mx-auto mb-8">
            Find vetted lawyers, surveyors, valuers, architects, movers and more — all connected to your STARA property journey.
          </p>
          <div className="max-w-lg mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search professionals..." className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#F4A100]"/>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-[#E7E5E0] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto">
          {PROFESSIONS.map(p => (<button key={p} onClick={() => setSelectedProfession(p)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${selectedProfession === p ? 'bg-[#E85D04] text-white' : 'bg-[#F5F4F0] text-[#57534E] hover:bg-[#E7E5E0]'}`}>
              {p}
            </button>))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-sm text-[#78716C] mb-6"><span className="font-bold text-[#1C1917]">{filtered.length}</span> professionals found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((pro) => (<div key={pro.id} className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <img src={pro.avatar} alt={pro.name} className="w-14 h-14 rounded-xl object-cover"/>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#1C1917] leading-snug">{pro.name}</p>
                    <p className="text-xs text-[#E85D04] font-semibold">{pro.profession}</p>
                    <p className="text-xs text-[#78716C] mt-0.5 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                      {pro.location}
                    </p>
                  </div>
                </div>

                {/* Verification */}
                {pro.verified ? (<div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 bg-green-50 rounded-lg">
                    <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    <span className="text-[11px] text-green-700 font-semibold">STARA Verified Professional</span>
                  </div>) : (<div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 bg-[#F5F4F0] rounded-lg">
                    <span className="text-[11px] text-[#78716C]">Not yet verified</span>
                  </div>)}

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(s => (<svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(pro.rating) ? 'text-[#F4A100]' : 'text-[#E7E5E0]'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>))}
                  </div>
                  <span className="text-xs font-semibold text-[#1C1917]">{pro.rating}</span>
                  <span className="text-xs text-[#78716C]">({pro.reviews} reviews)</span>
                </div>

                <p className="text-xs text-[#57534E] leading-relaxed mb-4 line-clamp-2">{pro.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {pro.services.slice(0, 3).map(s => (<span key={s} className="px-2 py-0.5 bg-[#F5F4F0] rounded-md text-[11px] text-[#57534E] font-medium">{s}</span>))}
                  {pro.services.length > 3 && <span className="px-2 py-0.5 bg-[#F5F4F0] rounded-md text-[11px] text-[#78716C]">+{pro.services.length - 3}</span>}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setRequestModal(pro)} className="flex-1 py-2.5 text-xs font-bold text-white rounded-lg transition-all" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                    Request Service
                  </button>
                  <button className="px-3 py-2.5 border border-[#E7E5E0] rounded-lg text-[#57534E] hover:border-[#E85D04] transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </button>
                </div>
              </div>
            </div>))}
        </div>

        {/* CTA for professionals */}
        <div className="mt-14 p-10 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, #1A2234, #2A3244)' }}>
          <p className="text-[#F4A100] text-sm font-semibold uppercase tracking-widest mb-2">Are You a Professional?</p>
          <h3 className="text-2xl font-bold text-white mb-3">Join the STARA Professional Network</h3>
          <p className="text-[#8B949E] text-sm mb-6 max-w-md mx-auto">
            Get verified, showcase your services, and connect with thousands of Kenyans looking for real estate professionals.
          </p>
          <button onClick={onShowAuth} className="px-8 py-3.5 bg-[#E85D04] hover:bg-[#C54D03] text-white font-bold rounded-xl transition-colors">
            Apply to Join
          </button>
        </div>
      </div>

      {/* Request Service Modal */}
      {requestModal && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget)
            setRequestModal(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#1C1917] text-lg">Request Service</h3>
              <button onClick={() => setRequestModal(null)} className="p-1.5 rounded-lg hover:bg-[#F5F4F0] text-[#78716C]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {requestSent ? (<div className="text-center py-8">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <p className="font-semibold text-[#1C1917]">Request sent!</p>
                <p className="text-sm text-[#78716C] mt-1">{requestModal.name} will contact you shortly.</p>
              </div>) : (<div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#F5F4F0] rounded-xl">
                  <img src={requestModal.avatar} alt={requestModal.name} className="w-10 h-10 rounded-lg object-cover"/>
                  <div>
                    <p className="font-semibold text-sm text-[#1C1917]">{requestModal.name}</p>
                    <p className="text-xs text-[#78716C]">{requestModal.profession}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Service Required</label>
                  <select className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]">
                    {requestModal.services.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Your Name</label>
                  <input className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]" placeholder="Full name"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Message</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] resize-none" placeholder="Describe what you need..."/>
                </div>
                <button onClick={handleRequest} className="w-full py-3 font-bold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                  Send Request
                </button>
              </div>)}
          </div>
        </div>)}
    </div>);
}
