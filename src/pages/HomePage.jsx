import { useState } from 'react';
import { ARTICLES, COUNTY_NAMES, PROPERTIES, STATS } from '../data/mockData';
import PropertyCard from '../components/PropertyCard';
import heroImage from '../imports/precondo-ca-QHDFm084RNk-unsplash.jpg';
import lifestyleImage from '../imports/clay-banks-urH155LONWs-unsplash.jpg';

const TABS = [
  { label: 'Buy', filter: 'sale' },
  { label: 'Rent', filter: 'rent' },
  { label: 'Land', filter: 'land' },
  { label: 'Commercial', filter: 'commercial' },
  { label: 'New developments', filter: 'new-development' },
];

export default function HomePage({ navigate, user, onShowAuth }) {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [location, setLocation] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [savedIds, setSavedIds] = useState(new Set());

  const featuredProperties = PROPERTIES.filter(property => property.featured).slice(0, 3);
  const nationwideProperties = PROPERTIES.filter(property => property.location.county !== 'Nairobi').slice(0, 4);
  const handleSave = (id) => {
    if (!user) {
      onShowAuth();
      return;
    }
    setSavedIds(previous => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const search = () => navigate('search', undefined, activeTab.filter);
  const searchCounty = (county) => navigate('search', undefined, activeTab.filter);

  return (
    <div className="bg-[#FAFAF8]">
      <section className="relative min-h-[min(720px,calc(100vh-64px))] flex items-center overflow-hidden">
        <img src={heroImage} alt="Modern Kenyan home" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/90 via-[#111827]/65 to-[#111827]/25" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-32 sm:pb-36">
          <div className="max-w-2xl">
            <p className="text-[#F4A100] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-4">Kenya-wide property search</p>
            <h1 className="text-4xl sm:text-6xl font-bold text-white leading-[1.05] mb-5">
              Find a place<br /><span className="text-[#F4A100]">that feels right.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-lg leading-relaxed mb-8">
              Homes, land and commercial spaces across all 47 counties, in one simple search.
            </p>

            <div className="bg-white rounded-2xl p-3 shadow-2xl max-w-2xl">
              <div className="flex gap-1 overflow-x-auto pb-2">
                {TABS.map(tab => (
                  <button
                    key={tab.filter}
                    onClick={() => { setActiveTab(tab); navigate('search', undefined, tab.filter); }}
                    className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab.filter === tab.filter ? 'bg-[#FFF1E6] text-[#E85D04]' : 'text-[#78716C] hover:bg-[#F5F4F0]'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select value={location} onChange={event => setLocation(event.target.value)} className="flex-1 min-w-0 px-4 py-3 bg-[#F5F4F0] rounded-xl text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30">
                  <option value="">Where are you looking?</option>
                  {COUNTY_NAMES.map(county => <option key={county} value={county}>{county} County</option>)}
                </select>
                <button onClick={search} className="px-6 py-3 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-shadow" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                  Search properties
                </button>
              </div>
            </div>
            <button onClick={() => navigate('ai-assistant')} className="inline-flex items-center mt-5 px-1 py-2 text-sm font-semibold text-white/80 hover:text-white transition-colors">
              Need help choosing? Ask STARA <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/25 backdrop-blur-sm border-t border-white/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[11px] text-white/65">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[#E85D04] text-xs font-bold uppercase tracking-[0.18em] mb-1">Start exploring</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">Featured properties</h2>
          </div>
          <button onClick={() => navigate('search')} className="text-sm font-bold text-[#E85D04] hover:underline">View all <span aria-hidden="true">→</span></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProperties.map(property => <PropertyCard key={property.id} property={property} navigate={navigate} onSave={handleSave} saved={savedIds.has(property.id)} />)}
        </div>
      </section>

      <section className="bg-[#F5F4F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-[#E85D04] text-xs font-bold uppercase tracking-[0.18em] mb-1">Search nationwide</p>
              <h2 className="text-2xl font-bold text-[#1C1917]">Choose a county</h2>
            </div>
            <button onClick={() => navigate('search')} className="self-start px-4 py-2.5 rounded-xl bg-[#1A2234] text-white text-sm font-bold hover:bg-[#2A344B]">Browse all counties</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {COUNTY_NAMES.slice(0, 20).map(county => (
              <button key={county} onClick={() => searchCounty(county)} className="px-3.5 py-2 rounded-full bg-white border border-[#E7E5E0] text-sm text-[#57534E] hover:border-[#E85D04] hover:text-[#E85D04] transition-colors">
                {county}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-2xl bg-[#1A2234] p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="flex items-center gap-3 lg:w-1/3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#E85D04] to-[#F4A100] text-white text-xl">✦</div>
            <div>
              <p className="text-white font-bold">Ask STARA</p>
              <p className="text-xs text-white/60">Describe what you need</p>
            </div>
          </div>
          <div className="flex flex-1 gap-2">
            <input value={aiPrompt} onChange={event => setAiPrompt(event.target.value)} onKeyDown={event => event.key === 'Enter' && navigate('ai-assistant')} placeholder="e.g. 2-bedroom apartment in Mombasa under KES 60,000" className="min-w-0 flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#F4A100]" />
            <button onClick={() => navigate('ai-assistant')} className="px-4 py-3 rounded-xl bg-[#F4A100] text-white text-sm font-bold whitespace-nowrap hover:bg-[#FFB830]">Ask</button>
          </div>
        </div>
      </section>

      <section className="bg-[#FFF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[#E85D04] text-xs font-bold uppercase tracking-[0.18em] mb-1">Beyond Nairobi</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">Property across Kenya</h2>
              <p className="text-sm text-[#78716C] mt-1">Discover homes, land and opportunities in every region.</p>
            </div>
            <button onClick={() => navigate('search')} className="text-sm font-bold text-[#E85D04] hover:underline whitespace-nowrap">Explore all →</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {nationwideProperties.map(property => (
              <button key={property.id} onClick={() => navigate('property', property.id)} className="group relative overflow-hidden rounded-2xl aspect-[4/3] text-left">
                <img src={property.images[0]} alt={property.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-[#F4A100] text-[10px] font-bold uppercase">{property.location.county} County</p>
                  <p className="text-white text-sm font-bold line-clamp-1">{property.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-[#E85D04] text-xs font-bold uppercase tracking-[0.18em] mb-1">Everything property</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917] mb-3">More than a listing platform</h2>
            <p className="text-sm text-[#78716C] leading-relaxed mb-5">STARA brings discovery, trusted professionals, market insight and property services together in one Kenya-first ecosystem.</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['🛡️', 'Verified listings', 'Search with confidence'],
                ['🤝', 'Trusted professionals', 'Find the right expert'],
                ['📊', 'Market insights', 'Make informed decisions'],
                ['📱', 'Built for mobile', 'Property search anywhere'],
              ].map(item => <div key={item[1]} className="rounded-xl border border-[#E7E5E0] p-3"><span className="text-lg">{item[0]}</span><p className="text-sm font-bold text-[#1C1917] mt-1">{item[1]}</p><p className="text-xs text-[#78716C]">{item[2]}</p></div>)}
            </div>
          </div>
          <img src={lifestyleImage} alt="STARA property community" className="w-full h-64 object-cover rounded-2xl" />
        </div>
      </section>

      <section className="bg-[#F5F4F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[#E85D04] text-xs font-bold uppercase tracking-[0.18em] mb-1">Stay informed</p>
              <h2 className="text-2xl font-bold text-[#1C1917]">Property insights</h2>
            </div>
            <button onClick={() => navigate('newsroom')} className="text-sm font-bold text-[#E85D04] hover:underline">View newsroom →</button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {ARTICLES.slice(0, 3).map(article => <button key={article.id} onClick={() => navigate('newsroom')} className="bg-white rounded-xl p-4 border border-[#E7E5E0] text-left hover:shadow-md transition-shadow"><span className="text-[10px] uppercase font-bold text-[#E85D04]">{article.category}</span><p className="font-bold text-sm text-[#1C1917] mt-2 line-clamp-2">{article.title}</p><p className="text-xs text-[#78716C] mt-2 line-clamp-2">{article.excerpt}</p></button>)}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="rounded-3xl bg-[#1A2234] px-6 py-10 sm:px-12 sm:py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <p className="text-[#F4A100] text-xs font-bold uppercase tracking-[0.18em] mb-2">Simple. Trusted. Nationwide.</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Your next property starts here.</h2>
            <p className="text-white/65 max-w-xl">Compare verified listings, connect with professionals and make your next move with confidence.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button onClick={() => navigate('search')} className="px-5 py-3 bg-[#E85D04] text-white font-bold rounded-xl hover:bg-[#D94F00]">Browse properties</button>
            {!user && <button onClick={onShowAuth} className="px-5 py-3 bg-white text-[#1A2234] font-bold rounded-xl hover:bg-[#FFF7F0]">Create account</button>}
          </div>
        </div>
      </section>
    </div>
  );
}
