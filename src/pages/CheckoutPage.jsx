import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { CART_TYPE_LABELS } from '../lib/cart/types';
import { formatKES } from '../lib/cart/format';
const STEPS = ['Review', 'Promo Code', 'Your Info', 'Billing', 'Payment', 'Review & Confirm'];
export default function CheckoutPage({ navigate }) {
    const { carts, totalsFor, setItemStatus, clearCart } = useCart();
    const { user } = useUser();
    const [cartType, setCartType] = useState('PROPERTY_SERVICE');
    const [step, setStep] = useState(0);
    const [confirmed, setConfirmed] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('mpesa');
    const cart = carts[cartType];
    const totals = totalsFor(cartType);
    const nonEmptyTypes = Object.keys(carts).filter((t) => carts[t].items.length > 0);
    if (nonEmptyTypes.length === 0 && !confirmed) {
        return (<div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-text mb-4">Your cart is empty.</p>
          <button onClick={() => navigate('search')} className="px-6 py-3 bg-primary text-text-inverse rounded-xl font-semibold">
            Explore Services
          </button>
        </div>
      </div>);
    }
    const handleConfirm = () => {
        // In production: submit to CheckoutService -> PaymentService, wait for the
        // payment provider webhook, THEN mark items confirmed. This local status
        // flip is a placeholder for that server round-trip.
        cart.items.forEach((item) => setItemStatus(cartType, item.id, cartType === 'PROPERTY_RESERVATION' ? 'confirmed' : 'confirmed'));
        setConfirmed(true);
    };
    const handleDone = () => {
        clearCart(cartType);
        navigate('dashboard');
    };
    if (confirmed) {
        return (<div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="text-5xl block mb-4">✅</span>
          <h2 className="text-2xl font-bold text-text mb-2">
            {cartType === 'PROPERTY_RESERVATION' ? 'Reservation confirmed' : 'Payment confirmed'}
          </h2>
          <p className="text-text-muted mb-6">
            {cartType === 'PROPERTY_RESERVATION'
                ? 'Your reservation is held. Our team will follow up with next steps for ownership transfer.'
                : 'A receipt has been sent to your email.'}
          </p>
          <button onClick={handleDone} className="px-6 py-3 bg-primary text-text-inverse rounded-xl font-semibold">
            Go to Dashboard
          </button>
        </div>
      </div>);
    }
    return (<div className="bg-background min-h-screen">
      <div className="bg-secondary py-10 text-center">
        <h1 className="text-3xl font-bold text-text-inverse mb-2">Checkout</h1>
        <p className="text-text-inverse/60 text-sm">Secure checkout — no payment details are stored on this device.</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {nonEmptyTypes.length > 1 && (<div className="flex gap-2 mb-6">
            {nonEmptyTypes.map((t) => (<button key={t} onClick={() => setCartType(t)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${cartType === t ? 'bg-primary text-text-inverse border-primary' : 'border-border text-text-muted'}`}>
                {CART_TYPE_LABELS[t]}
              </button>))}
          </div>)}

        {/* Stepper */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto">
          {STEPS.map((label, i) => (<div key={label} className="flex items-center flex-shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= step ? 'bg-primary text-text-inverse' : 'bg-disabled-bg text-disabled-text'}`}>
                {i + 1}
              </div>
              <span className={`ml-2 mr-3 text-xs whitespace-nowrap ${i === step ? 'text-text font-semibold' : 'text-text-muted'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && <div className="w-6 h-px bg-border"/>}
            </div>))}
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
          {step === 0 && (<div className="space-y-3">
              <h3 className="font-bold text-text mb-2">Review your cart — {CART_TYPE_LABELS[cartType]}</h3>
              {cart.items.map((item) => (<div key={item.id} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                  <span className="text-text">{item.title} × {item.quantity}</span>
                  <span className="text-text-muted">{formatKES(item.unitPrice * item.quantity)}</span>
                </div>))}
            </div>)}

          {step === 1 && (<div>
              <h3 className="font-bold text-text mb-2">Promo code</h3>
              <p className="text-sm text-text-muted mb-4">
                {cart.appliedPromo
                ? `${cart.appliedPromo.code} is applied to this cart.`
                : 'Apply a promo code from the cart page before continuing, or skip this step.'}
              </p>
            </div>)}

          {step === 2 && (<div className="space-y-3">
              <h3 className="font-bold text-text mb-2">Your information</h3>
              <input defaultValue={user?.name} placeholder="Full name" className="w-full px-3 py-2.5 rounded-xl border border-border text-sm"/>
              <input defaultValue={user?.email} placeholder="Email" className="w-full px-3 py-2.5 rounded-xl border border-border text-sm"/>
              <input defaultValue={user?.phone} placeholder="Phone" className="w-full px-3 py-2.5 rounded-xl border border-border text-sm"/>
            </div>)}

          {step === 3 && (<div className="space-y-3">
              <h3 className="font-bold text-text mb-2">Billing information</h3>
              <input placeholder="Billing address" className="w-full px-3 py-2.5 rounded-xl border border-border text-sm"/>
              <input placeholder="City / Town" className="w-full px-3 py-2.5 rounded-xl border border-border text-sm"/>
              <input placeholder="KRA PIN (optional, for receipt)" className="w-full px-3 py-2.5 rounded-xl border border-border text-sm"/>
            </div>)}

          {step === 4 && (<div className="space-y-3">
              <h3 className="font-bold text-text mb-2">Payment method</h3>
              {['mpesa', 'card'].map((m) => (<button key={m} onClick={() => setPaymentMethod(m)} className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold ${paymentMethod === m ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text'}`}>
                  {m === 'mpesa' ? 'M-Pesa' : 'Debit / Credit Card'}
                </button>))}
              <p className="text-xs text-text-muted">
                Payment is processed by our payment provider. Card and M-Pesa details are never stored on this device or sent to STARA's servers directly.
              </p>
            </div>)}

          {step === 5 && (<div className="space-y-1.5 text-sm">
              <h3 className="font-bold text-text mb-2">Review & confirm</h3>
              <div className="flex justify-between text-text-muted"><span>Subtotal</span><span>{formatKES(totals.subtotal)}</span></div>
              {totals.discount > 0 && (<div className="flex justify-between text-success"><span>Discount ({cart.appliedPromo?.code})</span><span>-{formatKES(totals.discount)}</span></div>)}
              <div className="flex justify-between text-text-muted"><span>Fees</span><span>{formatKES(totals.fees)}</span></div>
              <div className="flex justify-between text-text-muted"><span>Tax</span><span>{formatKES(totals.taxes)}</span></div>
              <div className="flex justify-between font-bold text-text text-base pt-2 border-t border-border mt-2">
                <span>Total due</span><span>{formatKES(totals.total)}</span>
              </div>
              <p className="text-xs text-text-muted pt-2">Paying via {paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'}.</p>
            </div>)}
        </div>

        <div className="flex justify-between">
          <button onClick={() => (step === 0 ? navigate('cart') : setStep((s) => s - 1))} className="px-5 py-2.5 rounded-xl border border-border text-text-muted font-semibold text-sm">
            {step === 0 ? 'Back to cart' : 'Back'}
          </button>
          {step < STEPS.length - 1 ? (<button onClick={() => setStep((s) => s + 1)} className="px-6 py-2.5 rounded-xl bg-primary text-text-inverse font-semibold text-sm hover:bg-primary-hover">
              Continue
            </button>) : (<button onClick={handleConfirm} className="px-6 py-2.5 rounded-xl bg-success text-text-inverse font-semibold text-sm">
              {cartType === 'PROPERTY_RESERVATION' ? 'Confirm Reservation' : `Pay ${formatKES(totals.total)}`}
            </button>)}
        </div>
      </div>
    </div>);
}
