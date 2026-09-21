import { useState } from 'react';
import { PROPERTIES, formatPrice } from '../data/mockData';
export default function InvestorPage({ navigate }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [calcPrice, setCalcPrice] = useState(8000000);
    const [calcRent, setCalcRent] = useState(65000);
    const [calcExpenses, setCalcExpenses] = useState(8000);
    const annualRent = calcRent * 12;
    const netRent = (calcRent - calcExpenses) * 12;
    const grossYield = ((annualRent / calcPrice) * 100).toFixed(2);
    const netYield = ((netRent / calcPrice) * 100).toFixed(2);
    const opportunities = PROPERTIES.filter(p => p.listing === 'sale' || p.listing === 'rent').slice(0, 4);
    return (<div className="bg-[#FAFAF8] min-h-screen">
      <div className="bg-[#1A2234] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <p className="text-[#8B949E] text-sm">Investment Platform</p>
            <h1 className="text-2xl font-bold mt-0.5">Investor Dashboard</h1>
          </div>
          <button onClick={() => navigate('search')} className="px-5 py-2.5 bg-[#E85D04] hover:bg-[#C54D03] text-white font-semibold rounded-xl text-sm">
            Find Opportunities
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 flex gap-1 overflow-x-auto pb-1">
          {['dashboard', 'opportunities', 'portfolio', 'analysis', 'market'].map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white/20 text-white' : 'text-[#8B949E] hover:text-white'}`}>
              {tab === 'market' ? 'Market Intel' : tab}
            </button>))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'dashboard' && (<>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Portfolio Value', value: 'KES 124M', trend: '+12.4%', trendUp: true },
                { label: 'Annual Rental Income', value: 'KES 4.8M', trend: '+8.2%', trendUp: true },
                { label: 'Avg. Gross Yield', value: '7.4%', trend: '+0.6%', trendUp: true },
                { label: 'Properties Tracked', value: '6', trend: '+1 new', trendUp: true },
            ].map(kpi => (<div key={kpi.label} className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
                  <p className="text-2xl font-bold text-[#E85D04]">{kpi.value}</p>
                  <p className="text-xs text-[#78716C] mt-1">{kpi.label}</p>
                  <p className={`text-xs font-semibold mt-1.5 ${kpi.trendUp ? 'text-green-600' : 'text-red-500'}`}>{kpi.trend} vs last year</p>
                </div>))}
            </div>

            {/* Yield calculator */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
              <h3 className="font-bold text-[#1C1917] mb-5">Quick Yield Calculator</h3>
              <div className="grid sm:grid-cols-3 gap-4 mb-5">
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Purchase Price (KES)</label>
                  <input type="number" value={calcPrice} onChange={e => setCalcPrice(Number(e.target.value))} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Monthly Rent (KES)</label>
                  <input type="number" value={calcRent} onChange={e => setCalcRent(Number(e.target.value))} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 block">Monthly Expenses (KES)</label>
                  <input type="number" value={calcExpenses} onChange={e => setCalcExpenses(Number(e.target.value))} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]"/>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                { label: 'Gross Yield', value: `${grossYield}%`, note: `${(annualRent / 1000).toFixed(0)}K annual` },
                { label: 'Net Yield', value: `${netYield}%`, note: `after expenses` },
                { label: 'Monthly Net', value: `KES ${(calcRent - calcExpenses).toLocaleString()}`, note: 'net cashflow' },
            ].map(r => (<div key={r.label} className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                    <p className="text-white/80 text-xs">{r.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{r.value}</p>
                    <p className="text-white/70 text-xs mt-0.5">{r.note}</p>
                  </div>))}
              </div>
            </div>

            {/* Top opportunities */}
            <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1C1917]">Top Investment Opportunities</h3>
                <button onClick={() => setActiveTab('opportunities')} className="text-sm text-[#E85D04] font-semibold">View all</button>
              </div>
              <div className="space-y-3">
                {opportunities.map(p => (<div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F5F4F0] cursor-pointer transition-colors" onClick={() => navigate('property', p.id)}>
                    <img src={p.images[0]} alt={p.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1C1917] truncate">{p.title}</p>
                      <p className="text-xs text-[#78716C]">{p.location.neighborhood}, {p.location.county}</p>
                      <p className="text-sm font-bold text-[#E85D04] mt-0.5">{formatPrice(p.price, p.pricePeriod)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {p.listing === 'sale' ? `${((p.price * 0.065 * 0.8) / p.price * 100).toFixed(1)}%` : '7.2%'}
                      </p>
                      <p className="text-xs text-[#78716C]">est. yield</p>
                    </div>
                  </div>))}
              </div>
            </div>
          </>)}

        {activeTab === 'market' && (<div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
              <h3 className="font-bold text-[#1C1917] mb-5">Kenya Market Intelligence</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                { area: 'Westlands', type: 'Apartments', avgYield: '7.8%', priceGrowth: '+9.2%', demand: 'Very High' },
                { area: 'Karen', type: 'Villas', avgYield: '5.4%', priceGrowth: '+14.1%', demand: 'High' },
                { area: 'Kilimani', type: 'Apartments', avgYield: '8.2%', priceGrowth: '+6.8%', demand: 'Very High' },
                { area: 'Syokimau', type: 'Houses', avgYield: '9.1%', priceGrowth: '+11.3%', demand: 'High' },
                { area: 'Nyali', type: 'Villas', avgYield: '6.3%', priceGrowth: '+8.7%', demand: 'Medium' },
                { area: 'Kiambu', type: 'Land', avgYield: 'N/A', priceGrowth: '+18.4%', demand: 'High' },
            ].map(m => (<div key={m.area} className="p-4 rounded-xl border border-[#E7E5E0]">
                    <p className="font-bold text-[#1C1917]">{m.area}</p>
                    <p className="text-xs text-[#78716C] mb-3">{m.type}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#78716C]">Avg. Yield</span>
                        <span className="font-semibold text-green-600">{m.avgYield}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#78716C]">Price Growth</span>
                        <span className="font-semibold text-[#E85D04]">{m.priceGrowth}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#78716C]">Demand</span>
                        <span className={`font-semibold ${m.demand === 'Very High' ? 'text-green-600' : m.demand === 'High' ? 'text-blue-600' : 'text-[#D97706]'}`}>{m.demand}</span>
                      </div>
                    </div>
                  </div>))}
              </div>
              <p className="text-xs text-[#A8A29E] mt-4">* Data is indicative based on STARA market analysis. Verify before investing. Past performance does not guarantee future returns.</p>
            </div>
          </div>)}

        {activeTab === 'opportunities' && (<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PROPERTIES.filter(p => p.listing === 'sale').map(p => (<div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-[#E7E5E0] hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('property', p.id)}>
                <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover"/>
                <div className="p-5">
                  <h3 className="font-bold text-[#1C1917]">{p.title}</h3>
                  <p className="text-sm text-[#78716C]">{p.location.neighborhood}, {p.location.county}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xl font-bold text-[#E85D04]">{formatPrice(p.price)}</p>
                      <p className="text-xs text-[#78716C]">Purchase price</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">~6.8%</p>
                      <p className="text-xs text-[#78716C]">Est. gross yield</p>
                    </div>
                  </div>
                  <button className="mt-3 w-full py-2 border border-[#E85D04] text-[#E85D04] font-semibold rounded-xl text-sm hover:bg-[#FFF7F0] transition-colors">
                    Analyse Investment
                  </button>
                </div>
              </div>))}
          </div>)}

        {(activeTab === 'portfolio' || activeTab === 'analysis') && (<div className="bg-white rounded-2xl p-12 border border-[#E7E5E0] text-center">
            <div className="w-20 h-20 bg-[#FFF7F0] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">{activeTab === 'portfolio' ? '📊' : '📈'}</span>
            </div>
            <h3 className="font-bold text-[#1C1917] text-lg mb-2">
              {activeTab === 'portfolio' ? 'Portfolio Tracker' : 'Advanced Analysis'}
            </h3>
            <p className="text-[#78716C] text-sm mb-6 max-w-sm mx-auto">
              {activeTab === 'portfolio' ? 'Track all your property investments, rental income and capital growth in one place.' : 'Deep ROI analysis, cash flow projections, and scenario modelling.'}
            </p>
            <button className="px-6 py-3 bg-[#E85D04] text-white font-semibold rounded-xl text-sm">
              Get Started
            </button>
          </div>)}
      </div>
    </div>);
}
