import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me';
/**
 * Role -> permission mapping, mirrored from src/context/UserContext.tsx on the
 * frontend. THIS is the copy that actually matters: every write endpoint
 * checks against this map, never against a role string the client claims to
 * have. The frontend copy only decides what UI to render.
 */
const ROLE_PERMISSIONS = {
    buyer: ['view_properties', 'save_properties', 'request_viewing', 'use_cart'],
    tenant: ['view_properties', 'save_properties', 'request_viewing', 'use_cart', 'view_lease'],
    seller: ['view_properties', 'create_listing', 'use_cart'],
    landlord: ['view_properties', 'manage_properties', 'manage_tenants', 'use_cart'],
    agent: ['view_properties', 'create_listing', 'manage_leads', 'use_cart'],
    agency: ['view_properties', 'create_listing', 'manage_agents', 'manage_leads', 'use_cart'],
    developer: ['view_properties', 'manage_projects', 'manage_units', 'use_cart'],
    investor: ['view_properties', 'view_market_insights', 'use_cart'],
    'property-manager': ['view_properties', 'manage_properties', 'manage_maintenance', 'use_cart'],
    admin: ['manage_promo_codes', 'manage_users', 'manage_listings', 'view_admin_analytics', 'use_cart'],
};
export function hasPermission(role, permission) {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
/** Verifies the bearer token and attaches the trusted user identity to the request. */
export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required.' });
    }
    try {
        const payload = jwt.verify(header.slice(7), JWT_SECRET);
        req.user = { id: payload.sub, role: payload.role, email: payload.email };
        next();
    }
    catch {
        return res.status(401).json({ message: 'Invalid or expired session.' });
    }
}
/** Use after requireAuth. Rejects unless req.user's role carries the given permission. */
export function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.user || !hasPermission(req.user.role, permission)) {
            return res.status(403).json({ message: 'You do not have permission to do this.' });
        }
        next();
    };
}
