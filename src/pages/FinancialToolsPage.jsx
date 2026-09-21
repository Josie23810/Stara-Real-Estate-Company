import { useState } from 'react';
export default function FinancialToolsPage() {
    const [activeCalc, setActiveCalc] = useState('mortgage');
    // Mortgage
    const [mortPrice, setMortPrice] = useState(15000000);
    const [mortDeposit, setMortDeposit] = useState(3000000);
    const [mortRate, setMortRate] = useState(13.5);
    const [mortTerm, setMortTerm] = useState(20);
    const loanAmount = mortPrice - mortDeposit;
    const monthlyRate = mortRate / 100 / 12;
    const numPayments = mortTerm * 12;
    const mortPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPaid = mortPayment * numPayments;
    const totalInterest = totalPaid - loanAmount;
    // Affordability
    const [monthlyIncome, setMonthlyIncome] = useState(350000);
    const [monthlyExpenses, setMonthlyExpenses] = useState(80000);
    const maxRent = (monthlyIncome - monthlyExpenses) * 0.3;
    const maxBuy = (monthlyIncome - monthlyExpenses) * 0.4;
    // Yield
    const [yieldPrice, setYieldPrice] = useState(8000000);
    const [yieldRent, setYieldRent] = useState(65000);
    const [yieldExpenses, setYieldExpenses] = useState(8000);
    const grossYield = ((yieldRent * 12) / yieldPrice * 100).toFixed(2);
    const netYield = (((yieldRent - yieldExpenses) * 12) / yieldPrice * 100).toFixed(2);
    // Stamp duty (Kenya: 2% up to 4M, 4% above)
    const [sdPrice, setSdPrice] = useState(15000000);
    let stampDuty = 0;
    if (sdPrice <= 4000000)
        stampDuty = sdPrice * 0.02;
    else
        stampDuty = 4000000 * 0.02 + (sdPrice - 4000000) * 0.04;
    const legalFees = sdPrice * 0.01;
    const valuationFee = sdPrice * 0.005;
    const totalCosts = stampDuty + legalFees + valuationFee + 15000;
    const CALCS = [
        { id: 'mortgage', label: 'Mortgage', icon: '🏦' },
        { id: 'affordability', label: 'Affordability', icon: '💰' },
        { id: 'yield', label: 'Rental Yield', icon: '📈' },
        { id: 'stamp-duty', label: 'Buying Costs', icon: '📋' },
        { id: 'comparison', label: 'Buy vs Rent', icon: '⚖️' },
    ];
    return (<div className="bg-[#FAFAF8] min-h-screen">
      {/* Header */}
      <div className="bg-[#1A2234] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#F4A100] text-sm font-semibold uppercase tracking-widest mb-2">STARA Finance</p>
          <h1 className="text-3xl font-bold text-white mb-3">Financial Tools</h1>
          <p className="text-[#8B949E] text-base">
            Calculate your mortgage, check affordability, analyse rental yields and understand buying costs.
          </p>
          <p className="text-xs text-[#8B949E] mt-2">All calculations are indicative. Consult a financial professional before making decisions.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Calculator tabs */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          {CALCS.map(c => (<button key={c.id} onClick={() => setActiveCalc(c.id)} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${activeCalc === c.id ? 'border-[#E85D04] bg-[#FFF7F0]' : 'border-[#E7E5E0] bg-white hover:border-[#E85D04]/40'}`}>
              <span className="text-2xl">{c.icon}</span>
              <span className={`text-xs font-semibold ${activeCalc === c.id ? 'text-[#E85D04]' : 'text-[#57534E]'}`}>{c.label}</span>
            </button>))}
        </div>

        {/* Mortgage Calculator */}
        {activeCalc === 'mortgage' && (<div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
              <h2 className="font-bold text-[#1C1917] text-lg mb-5">Mortgage Calculator</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 flex justify-between">
                    <span>Property Price</span>
                    <span className="text-[#E85D04] font-bold">KES {mortPrice.toLocaleString()}</span>
                  </label>
                  <input type="range" min={1000000} max={100000000} step={500000} value={mortPrice} onChange={e => setMortPrice(Number(e.target.value))} className="w-full accent-[#E85D04]"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 flex justify-between">
                    <span>Deposit</span>
                    <span className="text-[#E85D04] font-bold">KES {mortDeposit.toLocaleString()} ({Math.round(mortDeposit / mortPrice * 100)}%)</span>
                  </label>
                  <input type="range" min={0} max={mortPrice * 0.5} step={100000} value={mortDeposit} onChange={e => setMortDeposit(Number(e.target.value))} className="w-full accent-[#E85D04]"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 flex justify-between">
                    <span>Interest Rate</span>
                    <span className="text-[#E85D04] font-bold">{mortRate}% p.a.</span>
                  </label>
                  <input type="range" min={8} max={22} step={0.5} value={mortRate} onChange={e => setMortRate(Number(e.target.value))} className="w-full accent-[#E85D04]"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 flex justify-between">
                    <span>Loan Term</span>
                    <span className="text-[#E85D04] font-bold">{mortTerm} years</span>
                  </label>
                  <input type="range" min={5} max={30} step={1} value={mortTerm} onChange={e => setMortTerm(Number(e.target.value))} className="w-full accent-[#E85D04]"/>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                <p className="text-white/80 text-sm mb-1">Monthly Payment</p>
                <p className="text-4xl font-bold">KES {Math.round(mortPayment).toLocaleString()}</p>
                <p className="text-white/70 text-xs mt-1">Principal + Interest</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0] space-y-3">
                {[
                { label: 'Loan Amount', value: `KES ${loanAmount.toLocaleString()}` },
                { label: 'Total Repayment', value: `KES ${Math.round(totalPaid).toLocaleString()}` },
                { label: 'Total Interest', value: `KES ${Math.round(totalInterest).toLocaleString()}`, highlight: true },
                { label: 'LTV Ratio', value: `${Math.round(loanAmount / mortPrice * 100)}%` },
            ].map(item => (<div key={item.label} className="flex justify-between py-2 border-b border-[#F5F4F0] last:border-0">
                    <span className="text-sm text-[#78716C]">{item.label}</span>
                    <span className={`text-sm font-bold ${item.highlight ? 'text-[#DC2626]' : 'text-[#1C1917]'}`}>{item.value}</span>
                  </div>))}
              </div>
              <p className="text-xs text-[#A8A29E] text-center">Calculations are estimates. Consult your bank for official rates.</p>
            </div>
          </div>)}

        {/* Affordability */}
        {activeCalc === 'affordability' && (<div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
              <h2 className="font-bold text-[#1C1917] text-lg mb-5">Affordability Calculator</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 flex justify-between">
                    <span>Monthly Income</span>
                    <span className="text-[#E85D04] font-bold">KES {monthlyIncome.toLocaleString()}</span>
                  </label>
                  <input type="range" min={30000} max={2000000} step={10000} value={monthlyIncome} onChange={e => setMonthlyIncome(Number(e.target.value))} className="w-full accent-[#E85D04]"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#57534E] mb-1.5 flex justify-between">
                    <span>Monthly Expenses</span>
                    <span className="text-[#E85D04] font-bold">KES {monthlyExpenses.toLocaleString()}</span>
                  </label>
                  <input type="range" min={0} max={monthlyIncome * 0.8} step={5000} value={monthlyExpenses} onChange={e => setMonthlyExpenses(Number(e.target.value))} className="w-full accent-[#E85D04]"/>
                </div>
                <div className="p-4 bg-[#F5F4F0] rounded-xl">
                  <p className="text-sm text-[#78716C]">Net Disposable Income</p>
                  <p className="text-xl font-bold text-[#1C1917]">KES {(monthlyIncome - monthlyExpenses).toLocaleString()}/mo</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-blue-600 text-white">
                <p className="text-white/80 text-sm">Max Affordable Rent (30%)</p>
                <p className="text-3xl font-bold mt-1">KES {Math.round(maxRent).toLocaleString()}/mo</p>
              </div>
              <div className="p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                <p className="text-white/80 text-sm">Max Mortgage Payment (40%)</p>
                <p className="text-3xl font-bold mt-1">KES {Math.round(maxBuy).toLocaleString()}/mo</p>
                <p className="text-white/70 text-xs mt-1">≈ KES {Math.round(maxBuy / mortPayment * loanAmount / 1000000).toFixed(1)}M property</p>
              </div>
            </div>
          </div>)}

        {/* Yield */}
        {activeCalc === 'yield' && (<div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
              <h2 className="font-bold text-[#1C1917] text-lg mb-5">Rental Yield Calculator</h2>
              <div className="space-y-4">
                {[
                { label: 'Purchase Price', value: yieldPrice, setter: setYieldPrice, min: 500000, max: 100000000, step: 500000 },
                { label: 'Monthly Rent', value: yieldRent, setter: setYieldRent, min: 10000, max: 500000, step: 5000 },
                { label: 'Monthly Expenses', value: yieldExpenses, setter: setYieldExpenses, min: 0, max: 50000, step: 1000 },
            ].map(item => (<div key={item.label}>
                    <label className="text-sm font-medium text-[#57534E] mb-1.5 flex justify-between">
                      <span>{item.label}</span>
                      <span className="text-[#E85D04] font-bold">KES {item.value.toLocaleString()}</span>
                    </label>
                    <input type="range" min={item.min} max={item.max} step={item.step} value={item.value} onChange={e => item.setter(Number(e.target.value))} className="w-full accent-[#E85D04]"/>
                  </div>))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl text-white text-center" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                  <p className="text-white/80 text-xs mb-1">Gross Yield</p>
                  <p className="text-3xl font-bold">{grossYield}%</p>
                </div>
                <div className="p-5 rounded-2xl bg-green-600 text-white text-center">
                  <p className="text-white/80 text-xs mb-1">Net Yield</p>
                  <p className="text-3xl font-bold">{netYield}%</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E7E5E0] space-y-3">
                {[
                { label: 'Annual Gross Rent', value: `KES ${(yieldRent * 12).toLocaleString()}` },
                { label: 'Annual Expenses', value: `KES ${(yieldExpenses * 12).toLocaleString()}` },
                { label: 'Annual Net Income', value: `KES ${((yieldRent - yieldExpenses) * 12).toLocaleString()}` },
                { label: 'Payback Period', value: `${(yieldPrice / (yieldRent * 12)).toFixed(1)} years` },
            ].map(item => (<div key={item.label} className="flex justify-between py-2 border-b border-[#F5F4F0] last:border-0">
                    <span className="text-sm text-[#78716C]">{item.label}</span>
                    <span className="text-sm font-bold text-[#1C1917]">{item.value}</span>
                  </div>))}
              </div>
            </div>
          </div>)}

        {/* Stamp duty / Buying costs */}
        {activeCalc === 'stamp-duty' && (<div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
              <h2 className="font-bold text-[#1C1917] text-lg mb-5">Kenya Property Buying Costs</h2>
              <div>
                <label className="text-sm font-medium text-[#57534E] mb-1.5 flex justify-between">
                  <span>Purchase Price</span>
                  <span className="text-[#E85D04] font-bold">KES {sdPrice.toLocaleString()}</span>
                </label>
                <input type="range" min={500000} max={100000000} step={500000} value={sdPrice} onChange={e => setSdPrice(Number(e.target.value))} className="w-full accent-[#E85D04]"/>
              </div>
              <div className="mt-5 p-4 bg-[#F5F4F0] rounded-xl text-xs text-[#57534E] space-y-1">
                <p className="font-semibold text-[#1C1917]">Kenya Stamp Duty Rates:</p>
                <p>· 2% on first KES 4,000,000</p>
                <p>· 4% on the amount above KES 4,000,000</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
              <h2 className="font-bold text-[#1C1917] text-lg mb-5">Cost Breakdown</h2>
              <div className="space-y-3">
                {[
                { label: 'Stamp Duty', value: Math.round(stampDuty), note: `${(stampDuty / sdPrice * 100).toFixed(1)}% of price` },
                { label: 'Legal/Conveyancing Fees', value: Math.round(legalFees), note: '~1% of price' },
                { label: 'Valuation Fee', value: Math.round(valuationFee), note: '~0.5% of price' },
                { label: 'Agency Commission', value: 15000, note: 'Indicative' },
            ].map(item => (<div key={item.label} className="flex justify-between py-3 border-b border-[#F5F4F0]">
                    <div>
                      <p className="text-sm font-medium text-[#1C1917]">{item.label}</p>
                      <p className="text-xs text-[#78716C]">{item.note}</p>
                    </div>
                    <p className="text-sm font-bold text-[#1C1917]">KES {item.value.toLocaleString()}</p>
                  </div>))}
                <div className="flex justify-between pt-3">
                  <p className="font-bold text-[#1C1917]">Total Buying Costs</p>
                  <p className="font-bold text-[#E85D04] text-lg">KES {Math.round(totalCosts).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>)}

        {/* Buy vs Rent */}
        {activeCalc === 'comparison' && (<div className="bg-white rounded-2xl p-6 border border-[#E7E5E0]">
            <h2 className="font-bold text-[#1C1917] text-lg mb-3">Buy vs Rent Comparison</h2>
            <p className="text-sm text-[#78716C] mb-6">Compare the long-term financial outcome of buying versus renting.</p>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1C1917] flex items-center gap-2">🏠 Buying</h3>
                {[
                'Build equity over time',
                'Benefit from property appreciation',
                'Freedom to renovate',
                'Stability of ownership',
                'Higher upfront costs',
                'Maintenance responsibility',
            ].map((item, i) => (<div key={item} className={`flex items-center gap-2 text-sm ${i < 4 ? 'text-green-700' : 'text-[#78716C]'}`}>
                    <span>{i < 4 ? '✓' : '−'}</span>
                    {item}
                  </div>))}
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1C1917] flex items-center gap-2">🔑 Renting</h3>
                {[
                'Lower upfront commitment',
                'Flexibility to relocate',
                'Predictable monthly costs',
                'No maintenance burden',
                'No equity accumulation',
                'Rent increases over time',
            ].map((item, i) => (<div key={item} className={`flex items-center gap-2 text-sm ${i < 4 ? 'text-green-700' : 'text-[#78716C]'}`}>
                    <span>{i < 4 ? '✓' : '−'}</span>
                    {item}
                  </div>))}
              </div>
            </div>
            <div className="mt-6 p-4 bg-[#FFF7F0] rounded-xl border border-[#F4A100]/30">
              <p className="text-sm text-[#57534E]">
                <strong>STARA guidance:</strong> In Kenya&apos;s current market, buying is generally advantageous for those planning to stay for 5+ years, especially in high-growth areas like Westlands, Karen, and Kilimani. Renting is better for those needing flexibility. Always consult a financial advisor.
              </p>
            </div>
          </div>)}
      </div>
    </div>);
}
