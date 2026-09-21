import { useCart } from '../../context/CartContext';
import { formatKES } from '../../lib/cart/format';
const PLANS = [
    { itemType: 'agent_subscription', title: 'Agent Pro', billingPeriod: 'month', price: 2500, blurb: 'Unlimited listings, CRM, lead alerts' },
    { itemType: 'featured_listing_package', title: 'Featured Listing (x3)', billingPeriod: 'month', price: 4500, blurb: 'Top placement in search for 3 listings' },
    { itemType: 'verification_package', title: 'Bulk Verification Package', billingPeriod: 'month', price: 6000, blurb: 'Priority verification for up to 10 listings' },
];
export default function SubscriptionPlans({ navigate }) {
    const { addItem } = useCart();
    return (<div className="bg-surface rounded-2xl p-6 border border-border">
      <h3 className="font-bold text-text mb-1">Subscriptions & Packages</h3>
      <p className="text-sm text-text-muted mb-4">Grow your reach on STARA.</p>
      <div className="grid sm:grid-cols-3 gap-4">
        {PLANS.map((plan) => (<div key={plan.itemType} className="border border-border rounded-xl p-4 flex flex-col">
            <p className="font-semibold text-text text-sm">{plan.title}</p>
            <p className="text-xs text-text-muted mt-1 flex-1">{plan.blurb}</p>
            <p className="text-lg font-bold text-primary mt-3">
              {formatKES(plan.price)}<span className="text-xs font-normal text-text-muted">/{plan.billingPeriod}</span>
            </p>
            <button onClick={() => {
                const result = addItem('SUBSCRIPTION_SERVICE', {
                    itemType: plan.itemType,
                    title: plan.title,
                    provider: 'STARA',
                    unitPrice: plan.price,
                    quantity: 1,
                    billingPeriod: plan.billingPeriod,
                });
                if (result.ok)
                    navigate('cart');
            }} className="mt-3 py-2 text-sm font-semibold text-text-inverse bg-primary rounded-lg hover:bg-primary-hover transition-colors">
              Add to cart
            </button>
          </div>))}
      </div>
    </div>);
}
