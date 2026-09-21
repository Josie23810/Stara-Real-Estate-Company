import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CART_TYPE_LABELS } from '../lib/cart/types';
import { formatKES } from '../lib/cart/format';
import PromoCodeBox from '../components/cart/PromoCodeBox';
const TABS = ['PROPERTY_SERVICE', 'PROPERTY_RESERVATION', 'SUBSCRIPTION_SERVICE'];
const STATUS_STYLES = {
    added: 'bg-info-bg text-info',
    reserved: 'bg-warning-bg text-warning',
    pending_payment: 'bg-warning-bg text-warning',
    payment_processing: 'bg-info-bg text-info',
    confirmed: 'bg-success-bg text-success',
    cancelled: 'bg-error-bg text-error',
    expired: 'bg-disabled-bg text-disabled-text',
};
export default function CartPage({ navigate }) {
    const { carts, removeItem, setQuantity, totalsFor } = useCart();
    const [activeTab, setActiveTab] = useState('PROPERTY_SERVICE');
    const cart = carts[activeTab];
    const totals = totalsFor(activeTab);
    const isReservationCart = activeTab === 'PROPERTY_RESERVATION';
    return (<div className="bg-background min-h-screen">
      <div className="bg-secondary py-10 text-center">
        <h1 className="text-3xl font-bold text-text-inverse mb-2">Your Cart</h1>
        <p className="text-text-inverse/60 text-sm">Review items, apply a promo code, and check out.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {TABS.map((t) => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === t ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}>
              {CART_TYPE_LABELS[t]}
              {carts[t].items.length > 0 && (<span className="ml-1.5 text-xs text-text-muted">({carts[t].items.length})</span>)}
            </button>))}
        </div>

        {cart.items.length === 0 ? (<div className="text-center py-20">
            <span className="text-5xl block mb-4">🛒</span>
            <h2 className="text-xl font-bold text-text mb-2">Your cart is empty</h2>
            <p className="text-text-muted mb-6">Explore STARA services and discover what you need.</p>
            <button onClick={() => navigate('search')} className="px-6 py-3 bg-primary text-text-inverse font-semibold rounded-xl hover:bg-primary-hover transition-colors">
              Explore Services
            </button>
          </div>) : (<div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {cart.items.map((item) => (<div key={item.id} className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-text truncate">{item.title}</p>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_STYLES[item.status]}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                    {item.provider && <p className="text-xs text-text-muted mt-0.5">Provider: {item.provider}</p>}
                    {item.billingPeriod && item.billingPeriod !== 'one-time' && (<p className="text-xs text-text-muted">Billed {item.billingPeriod}ly</p>)}
                  </div>

                  {!isReservationCart && (<div className="flex items-center gap-2">
                      <button onClick={() => setQuantity(activeTab, item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg border border-border text-text-muted hover:border-primary hover:text-primary">
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => setQuantity(activeTab, item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg border border-border text-text-muted hover:border-primary hover:text-primary">
                        +
                      </button>
                    </div>)}

                  <p className="font-bold text-text w-28 text-right">{formatKES(item.unitPrice * item.quantity)}</p>

                  <button onClick={() => removeItem(activeTab, item.id)} className="text-text-muted hover:text-error text-sm" aria-label="Remove">
                    ✕
                  </button>
                </div>))}

              <button onClick={() => navigate('search')} className="text-sm font-semibold text-primary mt-2">
                ← Continue shopping
              </button>
            </div>

            {/* Summary */}
            <div className="bg-surface border border-border rounded-2xl p-5 h-fit space-y-5">
              <PromoCodeBox cartType={activeTab}/>

              <div className="space-y-1.5 text-sm border-t border-border pt-4">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span>{formatKES(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (<div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-{formatKES(totals.discount)}</span>
                  </div>)}
                <div className="flex justify-between text-text-muted">
                  <span>Fees</span>
                  <span>{formatKES(totals.fees)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Tax (VAT 16%)</span>
                  <span>{formatKES(totals.taxes)}</span>
                </div>
                <div className="flex justify-between font-bold text-text text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatKES(totals.total)}</span>
                </div>
              </div>

              <button onClick={() => navigate('checkout')} className="w-full py-3 bg-primary text-text-inverse font-semibold rounded-xl hover:bg-primary-hover active:bg-primary-active transition-colors">
                Proceed to Checkout
              </button>
              {isReservationCart && (<p className="text-[11px] text-text-muted leading-relaxed">
                  Reserving does not transfer ownership. Your unit is held pending payment and confirmation.
                </p>)}
            </div>
          </div>)}
      </div>
    </div>);
}
