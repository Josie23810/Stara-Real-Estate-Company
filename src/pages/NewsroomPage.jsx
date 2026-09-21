import { useState } from 'react';
import { ARTICLES } from '../data/mockData';
const MORE_ARTICLES = [
    { id: 'art5', title: 'Mombasa Real Estate: Rising Demand from Diaspora Buyers', excerpt: 'Kenyan diaspora are increasingly purchasing coastal properties in Mombasa and Kilifi as a combination of investment and lifestyle choice.', category: 'Market Insight', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=400&fit=crop&auto=format', author: 'Coastal Property Desk', date: '2026-08-12', readTime: 5 },
    { id: 'art6', title: "Kenya's Most Affordable Counties for Property in 2026", excerpt: 'With Nairobi prices continuing to rise, we analyse which Kenyan counties offer the best value for money for both buyers and renters.', category: 'Analysis', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop&auto=format', author: 'Data Team', date: '2026-08-05', readTime: 8 },
    { id: 'art7', title: 'How to Avoid Property Fraud in Kenya: A Complete Guide', excerpt: 'With rising cases of land fraud across Kenya, STARA\'s legal team outlines the verification steps every buyer must take before any transaction.', category: 'Security', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop&auto=format', author: 'STARA Legal', date: '2026-07-28', readTime: 11 },
    { id: 'art8', title: 'Understanding Title Deeds in Kenya: Freehold vs Leasehold', excerpt: 'A comprehensive breakdown of Kenya\'s land tenure systems — what each means for buyers, sellers and developers.', category: 'Education', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&auto=format', author: 'Advocate P. Ndegwa', date: '2026-07-15', readTime: 9 },
];
const ALL_ARTICLES = [...ARTICLES, ...MORE_ARTICLES];
const CATEGORIES = ['All', 'Market Report', 'Buying Guide', 'Legal', 'Investment', 'Market Insight', 'Analysis', 'Security', 'Education'];
export default function NewsroomPage({ navigate }) {
    const [category, setCategory] = useState('All');
    const [featured, setFeatured] = useState(ARTICLES[0]);
    const filtered = category === 'All' ? ALL_ARTICLES : ALL_ARTICLES.filter(a => a.category === category);
    return (<div className="bg-[#FAFAF8] min-h-screen">
      {/* Featured article hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={featured.image} alt={featured.title} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2234]/90 to-transparent"/>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
            <div className="max-w-lg">
              <span className="px-2 py-0.5 bg-[#E85D04] text-white text-xs font-semibold rounded-md">{featured.category}</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-3 leading-snug">{featured.title}</h1>
              <p className="text-white/70 text-sm mt-2">{featured.author} · {featured.readTime} min read</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-white border-b border-[#E7E5E0] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map(cat => (<button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${category === cat ? 'bg-[#E85D04] text-white' : 'bg-[#F5F4F0] text-[#57534E] hover:bg-[#E7E5E0]'}`}>
              {cat}
            </button>))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(article => (<button key={article.id} onClick={() => setFeatured(article)} className="group bg-white rounded-2xl overflow-hidden border border-[#E7E5E0] hover:shadow-md transition-shadow text-left">
              <img src={article.image} alt={article.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"/>
              <div className="p-4">
                <span className="px-2 py-0.5 bg-[#FFF7F0] text-[#E85D04] text-[11px] font-semibold rounded-md">{article.category}</span>
                <p className="font-semibold text-sm text-[#1C1917] mt-2 leading-snug line-clamp-2 group-hover:text-[#E85D04] transition-colors">{article.title}</p>
                <p className="text-xs text-[#78716C] mt-2 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-[#A8A29E]">
                  <span>{article.author}</span>
                  <span>·</span>
                  <span>{article.readTime} min read</span>
                  <span>·</span>
                  <span>{new Date(article.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </button>))}
        </div>

        {/* Newsletter */}
        <div className="mt-14 p-10 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, #1A2234, #2A3244)' }}>
          <p className="text-[#F4A100] text-sm font-semibold uppercase tracking-widest mb-2">STARA Weekly</p>
          <h3 className="text-2xl font-bold text-white mb-3">Stay ahead of Kenya&apos;s property market</h3>
          <p className="text-[#8B949E] text-sm mb-6">Market reports, investment opportunities, and expert guides delivered every week.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#F4A100]"/>
            <button className="px-6 py-3 bg-[#E85D04] text-white font-semibold rounded-xl text-sm whitespace-nowrap">Subscribe</button>
          </div>
        </div>
      </div>
    </div>);
}
