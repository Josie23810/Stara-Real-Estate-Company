import { pool } from '../db/pool.js';
/**
 * The single source of truth for "how much does this promo code save".
 * Called from POST /api/promo-codes/validate. Recomputes everything from
 * the database + the cart contents the client sent — it never reads a
 * discount amount off the request body.
 */
export async function calculateDiscount(params) {
    const { code, userId, userRole, userLocation, cartType, items } = params;
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const { rows } = await pool.query(`SELECT * FROM promo_codes WHERE code = $1`, [code.trim().toUpperCase()]);
    const promo = rows[0];
    if (!promo) {
        return { valid: false, message: 'This promo code does not exist.' };
    }
    if (!promo.active) {
        return { valid: false, message: 'This promo code has been disabled.' };
    }
    const now = new Date();
    if (promo.starts_at && now < new Date(promo.starts_at)) {
        return { valid: false, message: 'This promo code is not active yet.' };
    }
    if (promo.expires_at && now > new Date(promo.expires_at)) {
        return { valid: false, message: 'This promo code has expired.' };
    }
    if (!promo.applicable_cart_types.includes(cartType)) {
        return { valid: false, message: 'This promo code is not valid for this type of cart.' };
    }
    if (promo.applicable_item_types && promo.applicable_item_types.length > 0) {
        const anyMatch = items.some((i) => promo.applicable_item_types.includes(i.itemType));
        if (!anyMatch) {
            return { valid: false, message: 'This promo code does not apply to any item in your cart.' };
        }
    }
    if (promo.applicable_roles && promo.applicable_roles.length > 0 && !promo.applicable_roles.includes(userRole)) {
        return { valid: false, message: 'This promo code is not available for your account type.' };
    }
    if (promo.applicable_locations && promo.applicable_locations.length > 0) {
        if (!userLocation || !promo.applicable_locations.includes(userLocation)) {
            return { valid: false, message: 'This promo code is not available in your location.' };
        }
    }
    const minTxn = Number(promo.min_transaction_value);
    if (subtotal < minTxn) {
        return { valid: false, message: `A minimum spend of KES ${minTxn.toLocaleString()} is required for this code.` };
    }
    if (promo.usage_limit !== null && promo.times_used >= promo.usage_limit) {
        return { valid: false, message: 'This promo code has reached its usage limit.' };
    }
    const { rows: usageRows } = await pool.query(`SELECT COUNT(*) FROM promo_code_usage WHERE promo_code_id = $1 AND user_id = $2`, [promo.id, userId]);
    const timesUsedByUser = Number(usageRows[0].count);
    if (timesUsedByUser >= promo.per_user_limit) {
        return { valid: false, message: 'You have already used this promo code the maximum number of times.' };
    }
    if (promo.promo_type === 'first_time_user') {
        const { rows: orderRows } = await pool.query(`SELECT COUNT(*) FROM orders WHERE user_id = $1 AND status = 'confirmed'`, [userId]);
        if (Number(orderRows[0].count) > 0) {
            return { valid: false, message: 'This code is only valid for first-time users.' };
        }
    }
    // --- Compute the discount server-side ---
    let discount = 0;
    if (promo.percentage_off) {
        discount = subtotal * (Number(promo.percentage_off) / 100);
    }
    else if (promo.fixed_amount_off) {
        discount = Number(promo.fixed_amount_off);
    }
    if (promo.max_discount_amount) {
        discount = Math.min(discount, Number(promo.max_discount_amount));
    }
    discount = Math.min(discount, subtotal); // never discount more than the cart is worth
    discount = Math.round(discount);
    return {
        valid: true,
        message: `${promo.code} applied`,
        promoType: promo.promo_type,
        discountAmount: discount,
        originalAmount: subtotal,
        finalAmount: subtotal - discount,
    };
}
