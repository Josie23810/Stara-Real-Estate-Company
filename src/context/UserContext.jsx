import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
const DEFAULT_PREFERENCES = {
    preferredCounties: [],
    preferredTowns: [],
    communicationPrefs: { email: true, sms: false, whatsapp: true },
};
/** Role → permission strings. Purely for UI gating; server enforces the real rules. */
const ROLE_PERMISSIONS = {
    buyer: ['view_properties', 'save_properties', 'request_viewing', 'use_cart'],
    tenant: ['view_properties', 'save_properties', 'request_viewing', 'use_cart', 'view_lease'],
    seller: ['view_properties', 'create_listing', 'use_cart'],
    landlord: ['view_properties', 'manage_properties', 'manage_tenants', 'use_cart'],
    agent: ['view_properties', 'create_listing', 'manage_leads', 'use_cart'],
    agency: ['view_properties', 'create_listing', 'manage_agents', 'manage_leads', 'use_cart'],
    investor: ['view_properties', 'view_market_insights', 'use_cart'],
    'property-manager': ['view_properties', 'manage_properties', 'manage_maintenance', 'use_cart'],
    professional: ['view_properties', 'manage_services', 'manage_requests', 'use_cart'],
    admin: ['manage_promo_codes', 'manage_users', 'manage_listings', 'view_admin_analytics', 'use_cart'],
};
const UserContext = createContext(null);
const STORAGE_PREFIX = 'stara.user.';
const DEFAULT_VERIFICATION = { email: 'not_started', phone: 'not_started', identity: 'not_started', professional: 'not_applicable' };
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
    const [savedPropertyIds, setSavedPropertyIds] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [recentlyViewedIds, setRecentlyViewedIds] = useState([]);
    const [profile, setProfile] = useState({});
    const [verification, setVerification] = useState(DEFAULT_VERIFICATION);
    const [verificationDocuments, setVerificationDocuments] = useState({});
    const [notifications] = useState(3);
    // Per-user local persistence for preferences/activity (non-sensitive UX state only).
    useEffect(() => {
        if (!user)
            return;
        try {
            const raw = localStorage.getItem(STORAGE_PREFIX + user.id);
            if (raw) {
                const parsed = JSON.parse(raw);
                setPreferences({ ...DEFAULT_PREFERENCES, ...parsed.preferences });
                setSavedPropertyIds(parsed.savedPropertyIds ?? []);
                setRecentSearches(parsed.recentSearches ?? []);
                setRecentlyViewedIds(parsed.recentlyViewedIds ?? []);
                setProfile(parsed.profile ?? {});
                const storedDocuments = parsed.verificationDocuments ?? {};
                const storedVerification = parsed.verification ?? DEFAULT_VERIFICATION;
                const reviewRequiredVerification = Object.fromEntries(Object.entries(DEFAULT_VERIFICATION).map(([type, defaultStatus]) => [
                    type,
                    storedDocuments[type] ? storedVerification[type] : defaultStatus,
                ]));
                setVerification(reviewRequiredVerification);
                setVerificationDocuments(storedDocuments);
            }
        }
        catch {
            /* ignore corrupt local state */
        }
    }, [user?.id]);
    useEffect(() => {
        if (!user)
            return;
        localStorage.setItem(STORAGE_PREFIX + user.id, JSON.stringify({ preferences, savedPropertyIds, recentSearches, recentlyViewedIds, profile, verification, verificationDocuments }));
    }, [user, preferences, savedPropertyIds, recentSearches, recentlyViewedIds, profile, verification, verificationDocuments]);
    const signIn = useCallback((signedInUser) => {
        setUser(signedInUser);
        setVerification(signedInUser.initialVerification ?? (signedInUser.role === 'buyer'
            ? { email: 'not_started', phone: 'not_started', identity: 'not_applicable', professional: 'not_applicable' }
            : DEFAULT_VERIFICATION));
        setVerificationDocuments(signedInUser.initialVerificationDocuments ?? {});
        // In production this comes from the auth API response, not generated client-side.
        setAuthToken(`mock-session-${signedInUser.id}`);
    }, []);
    const signOut = useCallback(() => {
        setUser(null);
        setAuthToken(null);
        setPreferences(DEFAULT_PREFERENCES);
        setSavedPropertyIds([]);
        setRecentSearches([]);
        setRecentlyViewedIds([]);
        setProfile({});
        setVerification(DEFAULT_VERIFICATION);
        setVerificationDocuments({});
    }, []);
    const updatePreferences = useCallback((patch) => {
        setPreferences((prev) => ({ ...prev, ...patch }));
    }, []);
    const resetPreferences = useCallback(() => setPreferences(DEFAULT_PREFERENCES), []);
    const toggleSavedProperty = useCallback((propertyId) => {
        setSavedPropertyIds((prev) => prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]);
    }, []);
    const addRecentSearch = useCallback((query) => {
        if (!query.trim())
            return;
        setRecentSearches((prev) => [query, ...prev.filter((q) => q !== query)].slice(0, 10));
    }, []);
    const addRecentlyViewed = useCallback((propertyId) => {
        setRecentlyViewedIds((prev) => [propertyId, ...prev.filter((id) => id !== propertyId)].slice(0, 20));
    }, []);
    const updateProfile = useCallback((patch) => {
        setProfile(prev => ({ ...prev, ...patch }));
    }, []);
    const submitVerificationDocument = useCallback((type, document) => {
        setVerificationDocuments(prev => ({ ...prev, [type]: { name: document.name, size: document.size, submittedAt: new Date().toISOString() } }));
        setVerification(prev => ({ ...prev, [type]: 'submitted' }));
    }, []);
    const profileCompletion = useMemo(() => {
        if (!user) return 0;
        const fields = [user.name, user.email, user.phone || profile.phone, profile.country, profile.county, profile.town, profile.bio, profile.photo];
        const completed = fields.filter(Boolean).length;
        return Math.round((completed / fields.length) * 100);
    }, [user, profile]);
    const permissions = useMemo(() => (user ? ROLE_PERMISSIONS[user.role] ?? [] : []), [user]);
    const hasPermission = useCallback((permission) => permissions.includes(permission), [permissions]);
    const featureAccess = useMemo(() => ({
        canCreateListing: hasPermission('create_listing'),
        canManageAgency: hasPermission('manage_agents'),
        canAccessAdmin: user?.role === 'admin',
        canManagePromoCodes: hasPermission('manage_promo_codes'),
        canAccessInvestorTools: user?.role === 'investor',
    }), [hasPermission, user]);
    const value = {
        user,
        authToken,
        isAuthenticated: !!user,
        role: user?.role ?? null,
        permissions,
        hasPermission,
        preferences,
        updatePreferences,
        resetPreferences,
        savedPropertyIds,
        toggleSavedProperty,
        recentSearches,
        addRecentSearch,
        recentlyViewedIds,
        addRecentlyViewed,
        profile,
        updateProfile,
        profileCompletion,
        verification,
        setVerification,
        verificationDocuments,
        submitVerificationDocument,
        notifications,
        featureAccess,
        signIn,
        signOut,
    };
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx)
        throw new Error('useUser must be used within a UserProvider');
    return ctx;
}
