import { useEffect, useState } from 'react';
import { formatPrice } from '../data/mockData';
export default function PropertyCard({ property, navigate, onSave, saved = false, compact = false }) {
    const [isSaved, setIsSaved] = useState(saved);
    const [imgError, setImgError] = useState(false);
    useEffect(() => {
        setImgError(false);
    }, [property.images[0]]);
    const handleSave = (e) => {
        e.stopPropagation();
        setIsSaved(!isSaved);
        onSave?.(property.id);
    };
    const listingTag = {
        rent: { label: 'For Rent', color: 'bg-blue-600' },
        sale: { label: 'For Sale', color: 'bg-[#E85D04]' },
        land: { label: 'Land', color: 'bg-green-600' },
        commercial: { label: 'Commercial', color: 'bg-purple-600' },
        'new-development': { label: 'New Dev', color: 'bg-[#1A2234]' },
    }[property.listing] || { label: property.listing, color: 'bg-gray-600' };
    return (<div className="property-card bg-white rounded-2xl overflow-hidden border border-[#E7E5E0] cursor-pointer group" onClick={() => navigate('property', property.id)}>
      {/* Image */}
      <div className={`relative overflow-hidden bg-[#F5F4F0] ${compact ? 'h-44' : 'h-52'}`}>
        {!imgError ? (<img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgError(true)}/>) : (<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F5F4F0] to-[#E7E5E0]">
            <svg className="w-12 h-12 text-[#C6C3BC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
          </div>)}

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-2 py-0.5 ${listingTag.color} text-white text-[11px] font-semibold rounded-md`}>
            {listingTag.label}
          </span>
          {property.promoted && (<span className="px-2 py-0.5 bg-[#F4A100] text-white text-[11px] font-semibold rounded-md">
              Featured
            </span>)}
        </div>

        {/* Verification badge */}
        {property.verificationStatus === 'verified' && (<div className="absolute top-3 right-10 flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white text-[11px] font-semibold rounded-md">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            Verified
          </div>)}
        {property.verificationStatus === 'pending' && (<div className="absolute top-3 right-10 flex items-center gap-1 px-2 py-0.5 bg-[#D97706] text-white text-[11px] font-semibold rounded-md">
            Pending
          </div>)}

        {/* Save button */}
        <button onClick={handleSave} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-all hover:scale-110">
          <svg className={`w-4 h-4 transition-colors ${isSaved ? 'text-[#E85D04] fill-[#E85D04]' : 'text-[#78716C]'}`} fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

        {/* Under offer/sold badge */}
        {(property.status === 'under-offer' || property.status === 'sold' || property.status === 'let') && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-white text-[#1C1917] font-bold text-sm rounded-lg uppercase tracking-wide">
              {property.status === 'under-offer' ? 'Under Offer' : property.status === 'sold' ? 'Sold' : 'Let'}
            </span>
          </div>)}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[14px] text-[#1C1917] leading-snug line-clamp-2 group-hover:text-[#E85D04] transition-colors">
            {property.title}
          </h3>
        </div>

        <p className="text-[12px] text-[#78716C] flex items-center gap-1 mb-3">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          </svg>
          {property.location.neighborhood}, {property.location.county}
        </p>

        {/* Stats */}
        {!compact && (<div className="flex items-center gap-4 mb-3 text-[12px] text-[#57534E]">
            {property.bedrooms !== undefined && (<span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                {property.bedrooms} bd
              </span>)}
            {property.bathrooms !== undefined && (<span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                </svg>
                {property.bathrooms} ba
              </span>)}
            {property.area !== undefined && (<span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                </svg>
                {property.area.toLocaleString()} {property.areaUnit}
              </span>)}
          </div>)}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[17px] font-bold text-[#E85D04]">
              {formatPrice(property.price, property.pricePeriod)}
            </p>
          </div>
          {property.agent && (<div className="flex items-center gap-1.5">
              <img src={property.agent.avatar} alt={property.agent.name} className="w-6 h-6 rounded-full object-cover"/>
              <span className="text-[11px] text-[#78716C] hidden sm:block">{property.agent.name.split(' ')[0]}</span>
            </div>)}
        </div>
        <div className="flex gap-2 mt-4 pt-3 border-t border-[#F5F4F0]">
          <button onClick={(event) => { event.stopPropagation(); onSave?.(property.id); }} className="flex-1 py-2 rounded-lg border border-[#E7E5E0] text-xs font-semibold text-[#57534E] hover:border-[#E85D04] hover:text-[#E85D04]">
            {saved || isSaved ? 'Saved' : 'Save'}
          </button>
          <button onClick={(event) => { event.stopPropagation(); navigate('property', property.id); }} className="flex-1 py-2 rounded-lg bg-[#1A2234] text-white text-xs font-semibold hover:bg-[#2A344B]">
            View
          </button>
        </div>
      </div>
    </div>);
}
