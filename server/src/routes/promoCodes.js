import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { calculateDiscount } from '../services/discountCalculator.js';
export const promoCodesRouter = Router();
/**
 * POST /api/promo-codes/validate
 * Body: { code, cartType, items: [{itemType, referenceId?, unitPrice, quantity}] }
 * The client sends cart CONTENTS, never a discount amount. The response's
 * discountAmount is the only number the frontend is allowed to display/use.
 */
promoCodesRouter.post('/validate', requireAuth, async (req, res) => {
    const { code, cartType, items } = req.body ?? {};
    if (!code || !cartType || !Array.isArray(items)) {
        return res.status(400).json({ valid: false, message: 'Missing code, cartType, or items.' });
    }
    const { rows } = await pool.query(`SELECT location FROM users WHERE id = $1`, [req.user.id]);
    const result = await calculateDiscount({
        code,
        userId: req.user.id,
        userRole: req.user.role,
        userLocation: rows[0]?.location ?? null,
        cartType,
        items,
    });
    res.status(result.valid ? 200 : 400).json({ code: code.trim().toUpperCase(), ...result });
});
/** GET /api/promo-codes — admin: list all codes with usage. */
promoCodesRouter.get('/', requireAuth, requirePermission('manage_promo_codes'), async (_req, res) => {
    const { rows } = await pool.query(`SELECT pc.*,
            COALESCE(SUM(u.discount_applied), 0) AS total_discount_given,
            COUNT(u.id) AS total_redemptions
     FROM promo_codes pc
     LEFT JOIN promo_code_usage u ON u.promo_code_id = pc.id
     GROUP BY pc.id
     ORDER BY pc.created_at DESC`);
    res.json(rows);
});
/** POST /api/promo-codes — admin: create a code. */
promoCodesRouter.post('/', requireAuth, requirePermission('manage_promo_codes'), async (req, res) => {
    const b = req.body ?? {};
    if (!b.code || !b.promoType) {
        return res.status(400).json({ message: 'code and promoType are required.' });
    }
    try {
        const { rows } = await pool.query(`INSERT INTO promo_codes
        (code, campaign_id, promo_type, percentage_off, fixed_amount_off, max_discount_amount,
         min_transaction_value, applicable_cart_types, applicable_item_types, applicable_roles,
         applicable_locations, starts_at, expires_at, usage_limit, per_user_limit, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       RETURNING *`, [
            b.code.trim().toUpperCase(),
            b.campaignId ?? null,
            b.promoType,
            b.percentageOff ?? null,
            b.fixedAmountOff ?? null,
            b.maxDiscountAmount ?? null,
            b.minTransactionValue ?? 0,
            b.applicableCartTypes ?? ['PROPERTY_SERVICE', 'PROPERTY_RESERVATION', 'SUBSCRIPTION_SERVICE'],
            b.applicableItemTypes ?? null,
            b.applicableRoles ?? null,
            b.applicableLocations ?? null,
            b.startsAt ?? null,
            b.expiresAt ?? null,
            b.usageLimit ?? null,
            b.perUserLimit ?? 1,
            req.user.id,
        ]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        if (err.code === '23505')
            return res.status(409).json({ message: 'A promo code with this code already exists.' });
        res.status(500).json({ message: 'Could not create promo code.' });
    }
});
/** PATCH /api/promo-codes/:id — admin: edit / disable / set limits. */
promoCodesRouter.patch('/:id', requireAuth, requirePermission('manage_promo_codes'), async (req, res) => {
    const fields = req.body ?? {};
    const allowed = ['active', 'percentage_off', 'fixed_amount_off', 'max_discount_amount', 'min_transaction_value', 'usage_limit', 'per_user_limit', 'expires_at'];
    const sets = [];
    const values = [];
    Object.entries(fields).forEach(([key, value]) => {
        if (allowed.includes(key)) {
            values.push(value);
            sets.push(`${key} = $${values.length}`);
        }
    });
    if (sets.length === 0)
        return res.status(400).json({ message: 'No editable fields provided.' });
    values.push(req.params.id);
    const { rows } = await pool.query(`UPDATE promo_codes SET ${sets.join(', ')}, updated_at = now() WHERE id = $${values.length} RETURNING *`, values);
    if (!rows[0])
        return res.status(404).json({ message: 'Promo code not found.' });
    res.json(rows[0]);
});
/** DELETE /api/promo-codes/:id — admin: archive a code (soft delete via active=false is preferred). */
promoCodesRouter.delete('/:id', requireAuth, requirePermission('manage_promo_codes'), async (req, res) => {
    await pool.query(`DELETE FROM promo_codes WHERE id = $1`, [req.params.id]);
    res.status(204).end();
});
