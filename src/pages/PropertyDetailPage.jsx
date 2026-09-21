import { useState } from 'react';
import { PROPERTIES, formatPrice } from '../data/mockData';
import PropertyCard from '../components/PropertyCard';
import { useCart } from '../context/CartContext';
export default function PropertyDetailPage({ navigate, propertyId, user, onShowAuth }) {
    const property = PROPERTIES.find(p => p.id === propertyId) || PROPERTIES[0];
    const { addItem } = useCart();
    const [activeImage, setActiveImage] = useState(0);
    const [saved, setSaved] = useState(false);
    const [tab, setTab] = useState('overview');
    const [viewingModal, setViewingModal] = useState(false);
    const [contactModal, setContactModal] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [viewingForm, setViewingForm] = useState({ date: '', time: '', type: 'in-person' });
    const [messageSent, setMessageSent] = useState(false);
    const [viewingBooked, setViewingBooked] = useState(false);
    const [loanAmount, setLoanAmount] = useState(Math.round(property.price * 0.8));
    const [loanYears, setLoanYears] = useState(20);
    const [interestRate, setInterestRate] = useState(12.5);
    const monthlyPayment = useMemo_calc(loanAmount, interestRate, loanYears);
    const related = PROPERTIES.filter(p => p.id !== property.id && p.listing === property.listing).slice(0, 3);
    function useMemo_calc(amount, rate, years) {
        const r = rate / 100 / 12;
        const n = years * 12;
        if (r === 0)
            return amount / n;
        return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    const handleSend = async () => {
        if (!user) {
            onShowAuth();
            return;
        }
        await new Promise(r => setTimeout(r, 800));
        setMessageSent(true);
        setTimeout(() => { setContactModal(false); setMessageSent(false); }, 2000);
    };
    const handleViewingBook = async () => {
        if (!user) {
            onShowAuth();
            return;
        }
        await new Promise(r => setTimeout(r, 800));
        setViewingBooked(true);
        setTimeout(() => { setViewingModal(false); setViewingBooked(false); }, 2000);
    };
    return (<div className="bg-[#FAFAF8] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E7E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <button onClick={() => navigate('home')} className="text-[#78716C] hover:text-[#E85D04]">Home</button>
          <span className="text-[#D6D3CD]">/</span>
          <button onClick={() => navigate('search')} className="text-[#78716C] hover:text-[#E85D04]">Properties</button>
          <span className="text-[#D6D3CD]">/</span>
          <span className="text-[#1C1917] font-medium truncate">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="rounded-2xl overflow-hidden bg-[#F5F4F0]">
              <div className="relative h-72 sm:h-96">
                <img src={property.images[activeImage]} alt={property.title} className="w-full h-full object-cover"/>
                {/* Image nav */}
                {property.images.length > 1 && (<>
                    <button onClick={() => setActiveImage(Math.max(0, activeImage - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-md">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button onClick={() => setActiveImage(Math.min(property.images.length - 1, activeImage + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-md">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </button>
                  </>)}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {property.verificationStatus === 'verified' && (<span className="flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded-md">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      STARA Verified
                    </span>)}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/60 text-white text-xs rounded-lg">
                  {activeImage + 1} / {property.images.length} photos
                </div>
              </div>
              {property.images.length > 1 && (<div className="flex gap-2 p-3">
                  {property.images.map((img, i) => (<button key={i} onClick={() => setActiveImage(i)} className={`w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === i ? 'border-[#E85D04]' : 'border-transparent'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover"/>
                    </button>))}
                  {/* Virtual tour placeholder */}
                  <button className="w-20 h-14 rounded-xl bg-[#1A2234] flex flex-col items-center justify-center text-white flex-shrink-0 hover:bg-[#E85D04] transition-colors">
                    <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="text-[9px]">Virtual Tour</span>
                  </button>
                </div>)}
            </div>

            {/* Title & Key Stats */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-[#1C1917] leading-snug">{property.title}</h1>
                  <p className="text-[#78716C] mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                    {property.location.address}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSaved(!saved)} className={`p-2.5 rounded-xl border transition-colors ${saved ? 'border-[#E85D04] text-[#E85D04] bg-[#FFF7F0]' : 'border-[#E7E5E0] text-[#78716C] hover:border-[#E85D04]'}`}>
                    <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </button>
                  <button className="p-2.5 rounded-xl border border-[#E7E5E0] text-[#78716C] hover:border-[#E85D04] transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-6">
                {property.bedrooms !== undefined && (<div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF7F0] flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#E85D04]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#1C1917]">{property.bedrooms}</p>
                      <p className="text-xs text-[#78716C]">Bedrooms</p>
                    </div>
                  </div>)}
                {property.bathrooms !== undefined && (<div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF7F0] flex items-center justify-center">
                      <span className="text-base">🚿</span>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#1C1917]">{property.bathrooms}</p>
                      <p className="text-xs text-[#78716C]">Bathrooms</p>
                    </div>
                  </div>)}
                {property.area !== undefined && (<div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF7F0] flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#E85D04]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#1C1917]">{property.area.toLocaleString()}</p>
                      <p className="text-xs text-[#78716C]">{property.areaUnit}</p>
                    </div>
                  </div>)}
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#F5F4F0] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#78716C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#1C1917]">{property.views.toLocaleString()}</p>
                    <p className="text-xs text-[#78716C]">Views</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden">
              <div className="flex border-b border-[#E7E5E0]">
                {['overview', 'features', 'calculator'].map(t => (<button key={t} onClick={() => setTab(t)} className={`flex-1 py-3.5 text-sm font-semibold capitalize transition-colors ${tab === t ? 'text-[#E85D04] border-b-2 border-[#E85D04] bg-[#FFF7F0]' : 'text-[#78716C] hover:text-[#1C1917]'}`}>
                    {t === 'calculator' ? 'Mortgage' : t}
                  </button>))}
              </div>
              <div className="p-6">
                {tab === 'overview' && (<div>
                    <h3 className="font-semibold text-[#1C1917] mb-3">About this property</h3>
                    <p className="text-sm text-[#57534E] leading-relaxed">{property.description}</p>
                    <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {property.amenities.map((a) => (<div key={a} className="flex items-center gap-2 text-sm text-[#57534E]">
                          <svg className="w-4 h-4 text-[#E85D04] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          {a}
                        </div>))}
                    </div>
                  </div>)}
                {tab === 'features' && (<div>
                    <h3 className="font-semibold text-[#1C1917] mb-3">Property Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {property.features.map((f) => (<div key={f} className="flex items-center gap-2 px-3 py-2 bg-[#F5F4F0] rounded-lg text-sm text-[#57534E]">
                          <span className="text-[#F4A100]">★</span>
                          {f}
                        </div>))}
                    </div>
                    <div className="mt-6 p-4 bg-[#F5F4F0] rounded-xl">
                      <h4 className="font-semibold text-sm text-[#1C1917] mb-3">Property Documents</h4>
                      {['Title Deed', 'Floor Plan', 'Survey Report'].map((doc) => (<div key={doc} className="flex items-center justify-between py-2 border-b border-[#E7E5E0] last:border-0">
                          <span className="text-sm text-[#57534E] flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#E85D04]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            {doc}
                          </span>
                          <span className="text-xs text-green-600 font-semibold">Available on request</span>
                        </div>))}
                    </div>
                  </div>)}
                {tab === 'calculator' && (<div>
                    <h3 className="font-semibold text-[#1C1917] mb-4">Mortgage Calculator</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Loan Amount (KES)</label>
                        <input type="number" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]"/>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Interest Rate (%)</label>
                          <input type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} step="0.1" className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]"/>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Loan Term (years)</label>
                          <input type="number" value={loanYears} onChange={e => setLoanYears(Number(e.target.value))} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]"/>
                        </div>
                      </div>
                      <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                        <p className="text-white/80 text-sm mb-1">Estimated Monthly Payment</p>
                        <p className="text-3xl font-bold text-white">KES {Math.round(monthlyPayment).toLocaleString()}</p>
                        <p className="text-white/70 text-xs mt-1">Over {loanYears} years at {interestRate}% p.a.</p>
                      </div>
                      <button onClick={() => navigate('financial-tools')} className="text-sm text-[#E85D04] font-semibold hover:underline">
                        Open full financial tools →
                      </button>
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Similar Properties */}
            <div>
              <h3 className="font-bold text-xl text-[#1C1917] mb-4">Similar Properties</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map(p => (<PropertyCard key={p.id} property={p} navigate={navigate} compact/>))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Price */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E5E0] sticky top-32">
              <div className="mb-4">
                <p className="text-3xl font-bold text-[#E85D04]">{formatPrice(property.price, property.pricePeriod)}</p>
                {property.listing === 'sale' && (<p className="text-sm text-[#78716C] mt-0.5">Total price · Negotiable</p>)}
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={() => setViewingModal(true)} className="w-full py-3 font-bold text-white rounded-xl transition-all hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                  Schedule Viewing
                </button>
                <button onClick={() => setContactModal(true)} className="w-full py-3 font-bold text-[#E85D04] border-2 border-[#E85D04] rounded-xl hover:bg-[#FFF7F0] transition-colors">
                  Contact Agent
                </button>
                {property.agent && (<a href={`tel:${property.agent.phone}`} className="w-full py-3 font-bold text-[#1C1917] border border-[#E7E5E0] rounded-xl hover:bg-[#F5F4F0] transition-colors flex items-center justify-center gap-2 text-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    Call {property.agent.phone}
                  </a>)}
              </div>

              {/* Agent card */}
              {property.agent && (<div className="mt-5 pt-5 border-t border-[#F5F4F0]">
                  <div className="flex items-center gap-3">
                    <img src={property.agent.avatar} alt={property.agent.name} className="w-12 h-12 rounded-xl object-cover"/>
                    <div>
                      <p className="font-semibold text-sm text-[#1C1917]">{property.agent.name}</p>
                      <p className="text-xs text-[#78716C]">{property.agent.agency || 'Independent Agent'}</p>
                      {property.agent.verified && (<span className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                          Verified Agent
                        </span>)}
                    </div>
                  </div>
                </div>)}

              {/* Report */}
              <button className="mt-4 text-xs text-[#A8A29E] hover:text-[#DC2626] w-full text-center transition-colors">
                Report this listing
              </button>
            </div>

            {/* Verification */}
            <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
              <h4 className="font-semibold text-sm text-[#1C1917] mb-3">Verification Status</h4>
              {property.verificationStatus === 'verified' ? (<div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-700">STARA Verified</p>
                    <p className="text-xs text-[#78716C] mt-0.5">Title deed confirmed, listing details verified, agent identity verified.</p>
                  </div>
                </div>) : property.verificationStatus === 'pending' ? (<div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-yellow-700">Verification Pending</p>
                    <p className="text-xs text-[#78716C] mt-0.5">Our team is currently reviewing this listing.</p>
                  </div>
                </div>) : (<div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Not Yet Verified</p>
                    <p className="text-xs text-[#78716C] mt-0.5">Exercise due diligence before transacting.</p>
                  </div>
                </div>)}
              {property.verificationStatus !== 'verified' && (<button onClick={() => {
                const result = addItem('PROPERTY_SERVICE', {
                    itemType: 'verification_service',
                    referenceId: property.id,
                    title: `Independent Verification — ${property.title}`,
                    provider: 'STARA Verification Team',
                    unitPrice: 3500,
                    quantity: 1,
                });
                if (result.ok)
                    navigate('cart');
            }} className="w-full mt-4 py-2.5 text-sm font-semibold text-primary border border-primary rounded-xl hover:bg-primary/5 transition-colors">
                  Order Independent Verification — KES 3,500
                </button>)}
            </div>

            {property.listing === 'new-development' && (<div className="bg-white rounded-2xl p-5 border border-border">
                <h4 className="font-semibold text-sm text-text mb-1">Reserve this unit</h4>
                <p className="text-xs text-text-muted mb-3">
                  A reservation holds this unit while you arrange financing — it does not transfer ownership.
                </p>
                <button onClick={() => {
                const result = addItem('PROPERTY_RESERVATION', {
                    itemType: 'development_unit_reservation',
                    referenceId: property.id,
                    title: property.title,
                    provider: property.agent?.agency ?? property.agent?.name,
                    unitPrice: Math.round(property.price * 0.05),
                    quantity: 1,
                    metadata: { fullPrice: property.price },
                });
                if (result.ok)
                    navigate('cart');
            }} className="w-full py-2.5 text-sm font-semibold text-text-inverse bg-secondary rounded-xl hover:bg-secondary-hover transition-colors">
                  Reserve — 5% deposit
                </button>
              </div>)}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {contactModal && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget)
            setContactModal(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#1C1917] text-lg">Contact Agent</h3>
              <button onClick={() => setContactModal(false)} className="p-1.5 rounded-lg hover:bg-[#F5F4F0] text-[#78716C]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {messageSent ? (<div className="text-center py-8">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <p className="font-semibold text-[#1C1917]">Message sent!</p>
                <p className="text-sm text-[#78716C] mt-1">The agent will respond shortly.</p>
              </div>) : (<div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Your name</label>
                    <input value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]" placeholder="Full name"/>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Phone</label>
                    <input value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]" placeholder="+254 7..."/>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Email</label>
                  <input type="email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]" placeholder="you@email.com"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Message</label>
                  <textarea value={contactForm.message || `Hi, I am interested in "${property.title}". Please contact me.`} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} rows={4} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] resize-none"/>
                </div>
                <button onClick={handleSend} className="w-full py-3 font-bold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                  Send Message
                </button>
              </div>)}
          </div>
        </div>)}

      {/* Viewing Modal */}
      {viewingModal && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget)
            setViewingModal(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#1C1917] text-lg">Schedule a Viewing</h3>
              <button onClick={() => setViewingModal(false)} className="p-1.5 rounded-lg hover:bg-[#F5F4F0] text-[#78716C]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {viewingBooked ? (<div className="text-center py-8">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <p className="font-semibold text-[#1C1917]">Viewing booked!</p>
                <p className="text-sm text-[#78716C] mt-1">You will receive a confirmation shortly.</p>
              </div>) : (<div className="space-y-4">
                <div className="flex gap-3">
                  {['in-person', 'virtual'].map(type => (<button key={type} onClick={() => setViewingForm({ ...viewingForm, type })} className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${viewingForm.type === type ? 'border-[#E85D04] text-[#E85D04] bg-[#FFF7F0]' : 'border-[#E7E5E0] text-[#78716C]'}`}>
                      {type === 'in-person' ? '🏠 In-Person' : '📹 Virtual'}
                    </button>))}
                </div>
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Preferred Date</label>
                  <input type="date" value={viewingForm.date} onChange={e => setViewingForm({ ...viewingForm, date: e.target.value })} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Preferred Time</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['9:00', '11:00', '14:00', '16:00'].map(t => (<button key={t} onClick={() => setViewingForm({ ...viewingForm, time: t })} className={`py-2 rounded-lg border text-sm font-medium transition-all ${viewingForm.time === t ? 'border-[#E85D04] text-[#E85D04] bg-[#FFF7F0]' : 'border-[#E7E5E0] text-[#57534E]'}`}>
                        {t}
                      </button>))}
                  </div>
                </div>
                <button onClick={handleViewingBook} className="w-full py-3 font-bold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                  Confirm Viewing
                </button>
              </div>)}
          </div>
        </div>)}
    </div>);
}
