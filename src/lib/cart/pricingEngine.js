/** Flat service fee applied to paid checkouts. Mirrors server/src/services/discountCalculator.ts. */
const SERVICE_FEE_RATE = 0.015; // 1.5%
const VAT_RATE = 0.16; // Kenya VAT, applied to (subtotal - discount)
export function itemLineTotal(item) {
    return item.unitPrice * item.quantity;
}
export function computeSubtotal(items) {
    return items.reduce((sum, item) => sum + itemLineTotal(item), 0);
}
export function computeFees(subtotal) {
    if (subtotal <= 0)
        return 0;
    return Math.round(subtotal * SERVICE_FEE_RATE);
}
export function computeTaxes(taxableAmount) {
    if (taxableAmount <= 0)
        return 0;
    return Math.round(taxableAmount * VAT_RATE);
}
/**
 * Client-side totals for display only. The authoritative totals (especially
 * the discount) are always recomputed server-side at checkout — see
 * server/src/services/discountCalculator.ts. Never submit these numbers as
 * the amount to charge.
 */
export function computeTotals(cart) {
    const subtotal = computeSubtotal(cart.items);
    const discount = cart.appliedPromo?.discountAmount ?? 0;
    const cappedDiscount = Math.min(discount, subtotal);
    const fees = computeFees(subtotal - cappedDiscount);
    const taxes = computeTaxes(subtotal - cappedDiscount);
    const total = Math.max(0, subtotal - cappedDiscount + fees + taxes);
    return { subtotal, discount: cappedDiscount, fees, taxes, total };
}
