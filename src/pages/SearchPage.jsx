import { useState, useMemo, useEffect } from 'react';
import { PROPERTIES, COUNTY_NAMES } from '../data/mockData';
import PropertyCard from '../components/PropertyCard';
const COUNTIES = COUNTY_NAMES;
const TYPES = ['All Types', 'Apartment', 'House', 'Villa', 'Townhouse', 'Bungalow', 'Land', 'Office', 'Shop'];
const LISTINGS = [
    { value: 'all', label: 'All' },
    { value: 'rent', label: 'Rent' },
    { value: 'sale', label: 'Buy' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'new-development', label: 'New Developments' },
];
const SORT_OPTIONS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Views', 'Most Saved'];
export default function SearchPage({ navigate, onShowAuth, initialListingFilter = 'all' }) {
    const [searchQ, setSearchQ] = useState('');
    const [listingFilter, setListingFilter] = useState(initialListingFilter);
    const [countyFilter, setCountyFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [bedsFilter, setBedsFilter] = useState('');
    const [bathsFilter, setBathsFilter] = useState('');
    const [amenityFilter, setAmenityFilter] = useState('');
    const [verified, setVerified] = useState(false);
    const [sort, setSort] = useState('Newest');
    const [showFilters, setShowFilters] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [savedIds, setSavedIds] = useState(new Set());
    const [compareIds, setCompareIds] = useState(new Set());
    const [page, setPage] = useState(1);
    const PER_PAGE = 6;
    useEffect(() => {
        setListingFilter(initialListingFilter);
        setPage(1);
    }, [initialListingFilter]);
    const filtered = useMemo(() => {
        let result = [...PROPERTIES];
        if (searchQ)
            result = result.filter(p => p.title.toLowerCase().includes(searchQ.toLowerCase()) ||
                p.location.neighborhood.toLowerCase().includes(searchQ.toLowerCase()) ||
                p.location.county.toLowerCase().includes(searchQ.toLowerCase()));
        if (listingFilter !== 'all')
            result = result.filter(p => p.listing === listingFilter);
        if (countyFilter)
            result = result.filter(p => p.location.county === countyFilter);
        if (priceFilter)
            result = result.filter(p => p.price <= Number(priceFilter));
        if (typeFilter && typeFilter !== 'All Types')
            result = result.filter(p => p.type.toLowerCase().includes(typeFilter.toLowerCase()));
        if (bedsFilter)
            result = result.filter(p => p.bedrooms !== undefined && p.bedrooms >= parseInt(bedsFilter));
        if (bathsFilter)
            result = result.filter(p => p.bathrooms !== undefined && p.bathrooms >= parseInt(bathsFilter));
        if (amenityFilter)
            result = result.filter(p => p.amenities?.includes(amenityFilter));
        if (verified)
            result = result.filter(p => p.verificationStatus === 'verified');
        if (sort === 'Price: Low to High')
            result.sort((a, b) => a.price - b.price);
        else if (sort === 'Price: High to Low')
            result.sort((a, b) => b.price - a.price);
        else if (sort === 'Most Views')
            result.sort((a, b) => b.views - a.views);
        else if (sort === 'Most Saved')
            result.sort((a, b) => b.saves - a.saves);
        else
            result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        return result;
    }, [searchQ, listingFilter, countyFilter, priceFilter, typeFilter, bedsFilter, bathsFilter, amenityFilter, verified, sort]);
    const paginated = filtered.slice(0, page * PER_PAGE);
    const activeFilterCount = [countyFilter, priceFilter, typeFilter, bedsFilter, bathsFilter, amenityFilter, verified ? 'verified' : ''].filter(Boolean).length;
    const removeFilter = (filter) => {
        if (filter === 'county') setCountyFilter('');
        if (filter === 'price') setPriceFilter('');
        if (filter === 'type') setTypeFilter('');
        if (filter === 'beds') setBedsFilter('');
        if (filter === 'baths') setBathsFilter('');
        if (filter === 'amenity') setAmenityFilter('');
        if (filter === 'verified') setVerified(false);
        setPage(1);
    };
    const handleSave = (id) => {
        setSavedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    };
    const handleCompare = (id) => {
        setCompareIds(prev => {
            const n = new Set(prev);
            if (n.has(id)) {
                n.delete(id);
                return n;
            }
            if (n.size >= 3)
                return prev;
            n.add(id);
            return n;
        });
    };
    return (<div className="bg-[#FAFAF8] min-h-screen">
      {/* Search Header */}
      <div className="bg-[#1A2234] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-7">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <p className="text-[#F4A100] text-xs font-bold uppercase tracking-[0.2em] mb-2">Kenya-wide property search</p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Find your next home</h1>
              <p className="text-white/65 mt-2 text-sm max-w-xl">Search verified properties across Kenya.</p>
            </div>
            <button onClick={() => navigate('ai-assistant')} className="self-start md:self-auto flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm font-semibold hover:bg-white/15 transition-colors">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E85D04] to-[#F4A100] flex items-center justify-center">✦</span>
              Ask STARA
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white border-b border-[#E7E5E0] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex gap-3 flex-wrap">
            {/* Search input */}
            <div className="flex-1 min-w-48 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" value={searchQ} onChange={e => { setSearchQ(e.target.value); setPage(1); }} placeholder="Search rentals..." aria-label="Search properties" className="w-full pl-10 pr-4 py-3 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20"/>
            </div>
            <button onClick={() => setPage(1)} className="px-5 py-3 rounded-xl text-white text-sm font-bold shadow-sm hover:shadow-md transition-shadow" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
              Search
            </button>

            {/* Listing type tabs */}
            <div className="flex gap-1 p-1 bg-[#F5F4F0] rounded-xl">
              {LISTINGS.filter(item => item.value !== 'all' && item.value !== 'new-development').map((l) => (<button key={l.value} onClick={() => { setListingFilter(l.value); setPage(1); }} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${listingFilter === l.value ? 'bg-white text-[#E85D04] shadow-sm' : 'text-[#78716C]'}`}>
                  {l.label}
                </button>))}
            </div>

            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${showFilters ? 'border-[#E85D04] text-[#E85D04] bg-[#FFF7F0]' : 'border-[#E7E5E0] text-[#57534E] hover:border-[#E85D04]'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              Filters
              {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-[#E85D04] text-white text-[11px] flex items-center justify-center">{activeFilterCount}</span>}
            </button>

            <div className="flex gap-1">
              {['grid', 'list'].map(m => (<button key={m} onClick={() => setViewMode(m)} className={`p-2.5 rounded-xl border transition-colors ${viewMode === m ? 'border-[#E85D04] text-[#E85D04] bg-[#FFF7F0]' : 'border-[#E7E5E0] text-[#78716C]'}`}>
                  {m === 'grid'
                ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>}
                </button>))}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (<div className="mt-4 pt-4 border-t border-[#F5F4F0] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <select value={countyFilter} onChange={e => { setCountyFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]">
                <option value="">All Counties</option>
                {COUNTIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]">
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <select value={bedsFilter} onChange={e => { setBedsFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]">
                <option value="">Any Beds</option>
                <option value="1">1+ Beds</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
                <option value="4">4+ Beds</option>
                <option value="5">5+ Beds</option>
              </select>
              <select value={priceFilter} onChange={e => { setPriceFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]">
                <option>Any Price</option>
                <option>Under KES 50K/mo</option>
                <option>Under KES 100K/mo</option>
                <option>Under KES 200K/mo</option>
                <option>Under KES 10M</option>
                <option>Under KES 30M</option>
              </select>
              <select value={bathsFilter} onChange={e => { setBathsFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]">
                <option value="">Any Bathrooms</option>
                <option value="1">1+ Bathrooms</option>
                <option value="2">2+ Bathrooms</option>
                <option value="3">3+ Bathrooms</option>
              </select>
              <select value={amenityFilter} onChange={e => { setAmenityFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]">
                <option value="">Any Amenities</option>
                <option value="Parking">Parking</option>
                <option value="Swimming Pool">Swimming Pool</option>
                <option value="Gym">Gym</option>
                <option value="CCTV">CCTV</option>
              </select>
              <label className="flex items-center gap-2 px-3 py-2 border border-[#E7E5E0] rounded-xl cursor-pointer">
                <input type="checkbox" checked={verified} onChange={e => { setVerified(e.target.checked); setPage(1); }} className="accent-[#E85D04]"/>
                <span className="text-sm text-[#57534E] font-medium">Verified only</span>
              </label>
              <button onClick={() => { setSearchQ(''); setListingFilter('all'); setCountyFilter(''); setPriceFilter(''); setTypeFilter(''); setBedsFilter(''); setBathsFilter(''); setAmenityFilter(''); setVerified(false); setPage(1); }} className="px-3 py-2 text-sm text-[#E85D04] font-semibold border border-[#E85D04] rounded-xl hover:bg-[#FFF7F0] transition-colors">
                Clear All
              </button>
            </div>)}
          {(searchQ || listingFilter !== 'all' || activeFilterCount > 0) && (<div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-[#F5F4F0]">
            <span className="text-xs text-[#78716C]">Active:</span>
            {searchQ && <button onClick={() => { setSearchQ(''); setPage(1); }} className="px-2.5 py-1 rounded-full bg-[#FFF7F0] text-[#A94605] text-xs">“{searchQ}” ×</button>}
            {listingFilter !== 'all' && <button onClick={() => { setListingFilter('all'); setPage(1); }} className="px-2.5 py-1 rounded-full bg-[#FFF7F0] text-[#A94605] text-xs">{LISTINGS.find(item => item.value === listingFilter)?.label} ×</button>}
            {countyFilter && <button onClick={() => removeFilter('county')} className="px-2.5 py-1 rounded-full bg-[#FFF7F0] text-[#A94605] text-xs">{countyFilter} ×</button>}
            {typeFilter && <button onClick={() => removeFilter('type')} className="px-2.5 py-1 rounded-full bg-[#FFF7F0] text-[#A94605] text-xs">{typeFilter} ×</button>}
            {bedsFilter && <button onClick={() => removeFilter('beds')} className="px-2.5 py-1 rounded-full bg-[#FFF7F0] text-[#A94605] text-xs">{bedsFilter}+ bedrooms ×</button>}
            {verified && <button onClick={() => removeFilter('verified')} className="px-2.5 py-1 rounded-full bg-[#FFF7F0] text-[#A94605] text-xs">Verified only ×</button>}
          </div>)}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Results bar */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-[#78716C]">
              <span className="font-bold text-[#1C1917]">{filtered.length}</span> properties found
              {countyFilter && <span> in <span className="font-semibold text-[#1C1917]">{countyFilter}</span></span>}
            </p>
            <p className="text-xs text-[#A8A29E] mt-1">Updated listings from verified STARA partners</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-[#78716C]">Sort by:</label>
            <select value={sort} onChange={e => setSort(e.target.value)} className="px-3 py-1.5 border border-[#E7E5E0] rounded-lg text-sm focus:outline-none focus:border-[#E85D04]">
              {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[['47', 'Counties covered'], ['Verified', 'Trusted listings'], ['24/7', 'Ask STARA help']].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-[#E7E5E0] bg-white px-3 py-3 text-center">
                <p className="text-base sm:text-lg font-bold text-[#1A2234]">{value}</p>
                <p className="text-[10px] sm:text-xs text-[#78716C] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fast county navigation replaces the map for a simpler browsing flow. */}
        <div className="mb-6 rounded-2xl border border-[#E7E5E0] bg-white p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="font-bold text-[#1C1917]">Explore by county</p>
              <p className="text-xs text-[#78716C]">Browse verified homes, land and commercial spaces across Kenya.</p>
            </div>
            {countyFilter && <button onClick={() => { setCountyFilter(''); setPage(1); }} className="shrink-0 text-xs font-semibold text-[#E85D04]">Show all</button>}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['Nairobi', 'Mombasa', 'Kiambu', 'Kisumu', 'Nakuru', 'Machakos', 'Kilifi', 'Nyeri', 'Uasin Gishu'].map(county => (
              <button key={county} onClick={() => { setCountyFilter(county); setPage(1); }} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${countyFilter === county ? 'bg-[#E85D04] text-white' : 'bg-[#FFF7F0] text-[#A94605] hover:bg-[#FFE8D5]'}`}>
                {county}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#E85D04]">Quick picks</p>
              <h2 className="text-xl font-bold text-[#1C1917]">Properties across Kenya</h2>
            </div>
            <button onClick={() => setShowFilters(true)} className="text-xs font-semibold text-[#E85D04]">Refine results</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PROPERTIES.filter(property => property.location.county !== 'Nairobi').slice(0, 3).map(property => (
              <button key={property.id} onClick={() => navigate('property', property.id)} className="group flex items-center gap-3 rounded-xl border border-[#E7E5E0] bg-white p-3 text-left hover:border-[#E85D04]/50 hover:shadow-md transition-all">
                <img src={property.images[0]} alt={property.title} className="h-20 w-24 shrink-0 rounded-lg object-cover group-hover:scale-[1.03] transition-transform"/>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-[#E85D04]">{property.location.county} County</span>
                  <span className="mt-1 block line-clamp-2 text-sm font-semibold text-[#1C1917]">{property.title}</span>
                  <span className="mt-1 block text-xs text-[#78716C]">KES {property.price.toLocaleString()}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Compare bar */}
        {compareIds.size > 0 && (<div className="mb-4 p-3 bg-[#1A2234] rounded-xl flex items-center justify-between">
            <p className="text-white text-sm font-medium">{compareIds.size} properties selected for comparison</p>
            <div className="flex gap-2">
              <button onClick={() => setCompareIds(new Set())} className="text-xs text-[#8B949E] hover:text-white">Clear</button>
              <button className="px-4 py-1.5 bg-[#E85D04] text-white text-xs font-semibold rounded-lg">Compare Now</button>
            </div>
          </div>)}

        {/* Properties grid */}
        {filtered.length === 0 ? (<div className="text-center py-20">
            <div className="w-20 h-20 bg-[#F5F4F0] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#A8A29E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <h3 className="font-bold text-[#1C1917] text-lg mb-1">No properties found</h3>
            <p className="text-[#78716C] text-sm">Try adjusting your filters or search terms</p>
          </div>) : viewMode === 'grid' ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((property) => (<div key={property.id} className="relative">
                <PropertyCard property={property} navigate={navigate} onSave={handleSave} saved={savedIds.has(property.id)}/>
                <button onClick={() => handleCompare(property.id)} className={`absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${compareIds.has(property.id) ? 'bg-[#1A2234] text-white border-[#1A2234]' : 'bg-white text-[#57534E] border-[#E7E5E0] hover:border-[#E85D04]'}`}>
                  {compareIds.has(property.id) ? '✓ Comparing' : '+ Compare'}
                </button>
              </div>))}
          </div>) : (<div className="space-y-4">
            {paginated.map((property) => (<div key={property.id} className="bg-white rounded-2xl border border-[#E7E5E0] p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('property', property.id)}>
                <img src={property.images[0]} alt={property.title} className="w-40 h-32 rounded-xl object-cover flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[#1C1917] text-base hover:text-[#E85D04] transition-colors">{property.title}</h3>
                    {property.verificationStatus === 'verified' && (<span className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[11px] font-semibold rounded-md">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        Verified
                      </span>)}
                  </div>
                  <p className="text-sm text-[#78716C] mt-0.5">{property.location.neighborhood}, {property.location.county}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[#57534E]">
                    {property.bedrooms !== undefined && <span>{property.bedrooms} bed</span>}
                    {property.bathrooms !== undefined && <span>{property.bathrooms} bath</span>}
                    {property.area !== undefined && <span>{property.area.toLocaleString()} {property.areaUnit}</span>}
                  </div>
                  <p className="text-lg font-bold text-[#E85D04] mt-2">KES {property.price.toLocaleString()}{property.pricePeriod === 'month' ? '/mo' : ''}</p>
                </div>
              </div>))}
          </div>)}

        {/* Load more */}
        {paginated.length < filtered.length && (<div className="text-center mt-8">
            <button onClick={() => setPage(p => p + 1)} className="px-8 py-3 border-2 border-[#E85D04] text-[#E85D04] font-semibold rounded-xl hover:bg-[#FFF7F0] transition-colors">
              Load More Properties ({filtered.length - paginated.length} remaining)
            </button>
          </div>)}
      </div>
    </div>);
}
