/**
 * Shared cart architecture.
 *
 * Cart
 *  ├── CartItem
 *  ├── PricingEngine     (subtotal / fees / tax math — lib/cart/pricingEngine.ts)
 *  ├── DiscountEngine     (applies a validated promo code's discount — lib/cart/discountEngine.ts)
 *  ├── PromoCodeService   (talks to the backend — lib/promo/promoCodeClient.ts)
 *  ├── CheckoutService    (pages/CheckoutPage.tsx)
 *  └── PaymentService     (stubbed — see CheckoutPage)
 *
 * All three carts share this infrastructure. Only the allowed item types
 * and a few display fields differ per cart type.
 */
/** Which item "kinds" are allowed into which cart type. Enforced in CartContext.addItem(). */
export const CART_TYPE_ALLOWED_ITEM_TYPES = {
    PROPERTY_SERVICE: ['verification_service', 'inspection_service', 'listing_service', 'professional_service'],
    PROPERTY_RESERVATION: ['development_unit_reservation', 'property_reservation', 'viewing_booking'],
    SUBSCRIPTION_SERVICE: ['agent_subscription', 'property_manager_subscription', 'featured_listing_package', 'promotional_package', 'verification_package'],
};
export const CART_TYPE_LABELS = {
    PROPERTY_SERVICE: 'Services',
    PROPERTY_RESERVATION: 'Reservations',
    SUBSCRIPTION_SERVICE: 'Subscriptions',
};
