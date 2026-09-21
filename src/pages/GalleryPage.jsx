import { useState } from 'react';
const GALLERY_ITEMS = [
    { id: '1', category: 'Architecture', title: 'Modern Westlands', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', featured: true },
    { id: '2', category: 'Interiors', title: 'Luxury Living Room', image: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800&h=600&fit=crop', featured: false },
    { id: '3', category: 'Developments', title: 'Karen New Build', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c7f685?w=800&h=600&fit=crop', featured: true },
    { id: '4', category: 'Architecture', title: 'Coastal Villa', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop', featured: false },
    { id: '5', category: 'Interiors', title: 'Minimalist Kitchen', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop', featured: false },
    { id: '6', category: 'Architecture', title: 'Office Tower – Upperhill', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop', featured: false },
    { id: '7', category: 'Developments', title: 'Syokimau Townhouse Cluster', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', featured: true },
    { id: '8', category: 'Interiors', title: 'Master Bedroom Suite', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', featured: false },
    { id: '9', category: 'Architecture', title: 'Land in Kiambu', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop', featured: false },
];
const CATEGORIES = ['All', 'Architecture', 'Interiors', 'Developments'];
export default function GalleryPage() {
    const [category, setCategory] = useState('All');
    const [lightbox, setLightbox] = useState(null);
    const filtered = category === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.category === category);
    return (<div className="bg-[#FAFAF8] min-h-screen">
      <div className="bg-[#1A2234] py-14 text-center">
        <p className="text-[#F4A100] text-sm font-semibold uppercase tracking-widest mb-2">Visual Stories</p>
        <h1 className="text-3xl font-bold text-white mb-3">Property Gallery</h1>
        <p className="text-[#8B949E]">Inspiring spaces and architecture from across Kenya</p>
      </div>

      <div className="bg-white border-b border-[#E7E5E0] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex gap-2">
          {CATEGORIES.map(cat => (<button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-[#E85D04] text-white' : 'bg-[#F5F4F0] text-[#57534E] hover:bg-[#E7E5E0]'}`}>
              {cat}
            </button>))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {filtered.map(item => (<div key={item.id} className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer" onClick={() => setLightbox(item)}>
              <img src={item.image} alt={item.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                <span className="px-2 py-0.5 bg-[#E85D04] text-white text-[11px] font-semibold rounded-md">{item.category}</span>
                <p className="text-white font-semibold mt-1">{item.title}</p>
              </div>
            </div>))}
        </div>
      </div>

      {lightbox && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" onClick={() => setLightbox(null)}>
          <div className="max-w-4xl w-full p-4">
            <img src={lightbox.image} alt={lightbox.title} className="w-full rounded-2xl object-contain max-h-[80vh]"/>
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="px-2 py-0.5 bg-[#E85D04] text-white text-xs font-semibold rounded-md">{lightbox.category}</span>
                <p className="text-white font-semibold mt-1">{lightbox.title}</p>
              </div>
              <button onClick={() => setLightbox(null)} className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
