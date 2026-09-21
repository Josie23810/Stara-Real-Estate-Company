import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatKES } from '../../lib/cart/format';
export default function PromoCodeBox({ cartType }) {
    const { carts, applyPromoCode, clearPromoCode, totalsFor } = useCart();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cart = carts[cartType];
    const totals = totalsFor(cartType);
    const handleApply = async () => {
        if (!code.trim())
            return;
        setLoading(true);
        setError(null);
        const result = await applyPromoCode(cartType, code);
        setLoading(false);
        if (!result.ok) {
            setError(result.message);
        }
        else {
            setCode('');
        }
    };
    if (cart.appliedPromo) {
        return (<div className="rounded-xl border border-success/30 bg-success-bg p-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-text text-sm">
            <span className="text-success">{cart.appliedPromo.code} applied</span>
          </p>
          <button onClick={() => clearPromoCode(cartType)} className="text-xs text-text-muted hover:text-error underline">
            Remove
          </button>
        </div>
        <div className="mt-2 text-sm text-text-muted space-y-0.5">
          <p>Original: {formatKES(totals.subtotal)}</p>
          <p>Discount: -{formatKES(totals.discount)}</p>
          <p className="font-semibold text-text">Total: {formatKES(totals.total)}</p>
        </div>
      </div>);
    }
    return (<div>
      <p className="text-sm font-semibold text-text mb-2">Promo Code</p>
      <div className="flex gap-2">
        <input value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleApply()} placeholder="ENTER CODE" className="flex-1 px-3 py-2.5 rounded-xl border border-border text-sm uppercase focus:outline-none focus:border-primary bg-surface"/>
        <button onClick={handleApply} disabled={loading || !code.trim()} className="px-5 py-2.5 rounded-xl bg-primary text-text-inverse text-sm font-semibold disabled:bg-disabled-bg disabled:text-disabled-text hover:bg-primary-hover active:bg-primary-active transition-colors">
          {loading ? 'Applying…' : 'Apply'}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>);
}
