import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { CART_TYPE_ALLOWED_ITEM_TYPES } from '../lib/cart/types';
import { computeTotals } from '../lib/cart/pricingEngine';
import { validatePromoCode } from '../lib/promo/promoCodeClient';
import { useUser } from './UserContext';
const CART_TYPES = ['PROPERTY_SERVICE', 'PROPERTY_RESERVATION', 'SUBSCRIPTION_SERVICE'];
const STORAGE_KEY = 'stawi.carts.v1';
function emptyCarts() {
    return {
        PROPERTY_SERVICE: { cartType: 'PROPERTY_SERVICE', items: [], appliedPromo: null },
        PROPERTY_RESERVATION: { cartType: 'PROPERTY_RESERVATION', items: [], appliedPromo: null },
        SUBSCRIPTION_SERVICE: { cartType: 'SUBSCRIPTION_SERVICE', items: [], appliedPromo: null },
    };
}
function loadCarts() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return emptyCarts();
        const parsed = JSON.parse(raw);
        return { ...emptyCarts(), ...parsed };
    }
    catch {
        return emptyCarts();
    }
}
function reducer(state, action) {
    switch (action.type) {
        case 'HYDRATE':
            return action.state;
        case 'ADD_ITEM': {
            const cart = state[action.item.cartType];
            return { ...state, [action.item.cartType]: { ...cart, items: [...cart.items, action.item] } };
        }
        case 'REMOVE_ITEM': {
            const cart = state[action.cartType];
            return {
                ...state,
                [action.cartType]: { ...cart, items: cart.items.filter((i) => i.id !== action.itemId) },
            };
        }
        case 'SET_QUANTITY': {
            const cart = state[action.cartType];
            return {
                ...state,
                [action.cartType]: {
                    ...cart,
                    items: cart.items.map((i) => i.id === action.itemId ? { ...i, quantity: Math.max(1, action.quantity) } : i),
                },
            };
        }
        case 'SET_ITEM_STATUS': {
            const cart = state[action.cartType];
            return {
                ...state,
                [action.cartType]: {
                    ...cart,
                    items: cart.items.map((i) => (i.id === action.itemId ? { ...i, status: action.status } : i)),
                },
            };
        }
        case 'APPLY_PROMO': {
            const cart = state[action.cartType];
            return { ...state, [action.cartType]: { ...cart, appliedPromo: action.promo } };
        }
        case 'CLEAR_PROMO': {
            const cart = state[action.cartType];
            return { ...state, [action.cartType]: { ...cart, appliedPromo: null } };
        }
        case 'CLEAR_CART': {
            return { ...state, [action.cartType]: { cartType: action.cartType, items: [], appliedPromo: null } };
        }
        default:
            return state;
    }
}
const CartContext = createContext(null);
export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, undefined, loadCarts);
    const { authToken } = useUser();
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);
    const addItem = useCallback((cartType, item) => {
        const allowed = CART_TYPE_ALLOWED_ITEM_TYPES[cartType];
        if (!allowed.includes(item.itemType)) {
            return {
                ok: false,
                message: `"${item.itemType}" cannot be added to the ${cartType.replace('_', ' ').toLowerCase()} cart.`,
            };
        }
        const fullItem = {
            id: `${cartType}-${crypto.randomUUID()}`,
            cartType,
            status: item.status ?? (cartType === 'PROPERTY_RESERVATION' ? 'reserved' : 'added'),
            addedAt: new Date().toISOString(),
            ...item,
        };
        dispatch({ type: 'ADD_ITEM', item: fullItem });
        return { ok: true };
    }, []);
    const removeItem = useCallback((cartType, itemId) => {
        dispatch({ type: 'REMOVE_ITEM', cartType, itemId });
    }, []);
    const setQuantity = useCallback((cartType, itemId, quantity) => {
        dispatch({ type: 'SET_QUANTITY', cartType, itemId, quantity });
    }, []);
    const setItemStatus = useCallback((cartType, itemId, status) => {
        dispatch({ type: 'SET_ITEM_STATUS', cartType, itemId, status });
    }, []);
    const applyPromoCode = useCallback(async (cartType, code) => {
        const cart = state[cartType];
        const result = await validatePromoCode(code, cart, authToken);
        if (!result.valid || result.discountAmount === undefined) {
            return { ok: false, message: result.message };
        }
        dispatch({
            type: 'APPLY_PROMO',
            cartType,
            promo: {
                code: result.code,
                discountAmount: result.discountAmount,
                promoType: result.promoType ?? 'unknown',
                message: result.message,
            },
        });
        return { ok: true, message: result.message };
    }, [state, authToken]);
    const clearPromoCode = useCallback((cartType) => {
        dispatch({ type: 'CLEAR_PROMO', cartType });
    }, []);
    const clearCart = useCallback((cartType) => {
        dispatch({ type: 'CLEAR_CART', cartType });
    }, []);
    const totalsFor = useCallback((cartType) => computeTotals(state[cartType]), [state]);
    const itemCount = useMemo(() => CART_TYPES.reduce((sum, t) => sum + state[t].items.reduce((s, i) => s + i.quantity, 0), 0), [state]);
    const value = {
        carts: state,
        itemCount,
        addItem,
        removeItem,
        setQuantity,
        setItemStatus,
        applyPromoCode,
        clearPromoCode,
        clearCart,
        totalsFor,
    };
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx)
        throw new Error('useCart must be used within a CartProvider');
    return ctx;
}
