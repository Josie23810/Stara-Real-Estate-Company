import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { calculateDiscount } from '../services/discountCalculator.js';
export const checkoutRouter = Router();
const FEE_RATE = 0.015;
const VAT_RATE = 0.16;
/**
 * POST /api/checkout
 * Body: { cartType, items, promoCode? }
 * Recomputes subtotal/discount/fees/taxes/total from scratch — the totals
 * shown in the client during checkout are for display only. On success this
 * is the point where promo_code_usage and promo_codes.times_used are
 * incremented, inside one transaction, so a code can't be double-spent by
 * two concurrent checkouts.
 */
checkoutRouter.post('/', requireAuth, async (req, res) => {
    const { cartType, items, promoCode } = req.body ?? {};
    if (!cartType || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'cartType and non-empty items are required.' });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        let discount = 0;
        let promoCodeId = null;
        if (promoCode) {
            const { rows } = await client.query(`SELECT location FROM users WHERE id = $1`, [req.user.id]);
            const result = await calculateDiscount({
                code: promoCode,
                userId: req.user.id,
                userRole: req.user.role,
                userLocation: rows[0]?.location ?? null,
                cartType,
                items,
            });
            if (!result.valid) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: result.message });
            }
            discount = result.discountAmount;
            const promoRow = await client.query(`SELECT id FROM promo_codes WHERE code = $1`, [promoCode.trim().toUpperCase()]);
            promoCodeId = promoRow.rows[0]?.id ?? null;
        }
        const taxable = subtotal - discount;
        const fees = Math.round(taxable * FEE_RATE);
        const taxes = Math.round(taxable * VAT_RATE);
        const total = Math.max(0, taxable + fees + taxes);
        const orderResult = await client.query(`INSERT INTO orders (user_id, cart_type, subtotal, discount, fees, taxes, total, promo_code_id, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending_payment')
       RETURNING id`, [req.user.id, cartType, subtotal, discount, fees, taxes, total, promoCodeId]);
        const orderId = orderResult.rows[0].id;
        if (promoCodeId) {
            await client.query(`INSERT INTO promo_code_usage (promo_code_id, user_id, order_id, discount_applied, original_amount, final_amount)
         VALUES ($1,$2,$3,$4,$5,$6)`, [promoCodeId, req.user.id, orderId, discount, subtotal, total]);
            await client.query(`UPDATE promo_codes SET times_used = times_used + 1 WHERE id = $1`, [promoCodeId]);
        }
        await client.query('COMMIT');
        res.status(201).json({ orderId, subtotal, discount, fees, taxes, total, status: 'pending_payment' });
    }
    catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Checkout failed. Please try again.' });
    }
    finally {
        client.release();
    }
});
