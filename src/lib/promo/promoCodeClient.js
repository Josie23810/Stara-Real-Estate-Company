const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

/**
 * Sends the code + cart contents to the backend and gets back a
 * server-calculated discount. The frontend NEVER decides the discount
 * amount itself — it only renders whatever the API returns.
 */
export async function validatePromoCode(code, cart, authToken) {
    try {
        const res = await fetch(API_BASE + '/api/promo-codes/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { Authorization: 'Bearer ' + authToken } : {}),
            },
            body: JSON.stringify({
                code: String(code).trim().toUpperCase(),
                cartType: cart.cartType,
                items: cart.items.map((i) => ({
                    itemType: i.itemType,
                    referenceId: i.referenceId,
                    unitPrice: i.unitPrice,
                    quantity: i.quantity,
                })),
            }),
        });

        const data = await res.json();
        if (!res.ok) {
            return { valid: false, code, message: data.message ?? 'Could not validate this code right now.' };
        }

        return data;
    } catch {
        return { valid: false, code, message: 'Network error validating promo code. Please try again.' };
    }
}