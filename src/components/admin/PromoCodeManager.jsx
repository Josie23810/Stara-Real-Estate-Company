import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { formatKES } from '../../lib/cart/format';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';
const PROMO_TYPES = [
    'percentage', 'fixed_amount', 'first_time_user', 'referral',
    'campaign', 'professional_service', 'listing', 'subscription', 'limited_time',
];

export default function PromoCodeManager() {
    const { authToken, featureAccess } = useUser();
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        code: '', promoType: 'percentage', percentageOff: '10', fixedAmountOff: '',
        minTransactionValue: '0', usageLimit: '', perUserLimit: '1', expiresAt: '',
    });

    const load = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(API_BASE + '/api/promo-codes', {
                headers: {
                    ...(authToken ? { Authorization: 'Bearer ' + authToken } : {}),
                },
            });

            if (!res.ok) throw new Error('Could not load promo codes.');
            setCodes(await res.json());
        } catch {
            setError('Could not reach the STARA API. Start the server in /server to manage promo codes here.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (featureAccess.canManagePromoCodes) load();
    }, [featureAccess.canManagePromoCodes]);

    const handleCreate = async () => {
        try {
            const res = await fetch(API_BASE + '/api/promo-codes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(authToken ? { Authorization: 'Bearer ' + authToken } : {}),
                },
                body: JSON.stringify({
                    code: form.code,
                    promoType: form.promoType,
                    percentageOff: form.promoType === 'percentage' ? Number(form.percentageOff) : null,
                    fixedAmountOff: form.promoType === 'fixed_amount' ? Number(form.fixedAmountOff) : null,
                    minTransactionValue: Number(form.minTransactionValue) || 0,
                    usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
                    perUserLimit: Number(form.perUserLimit) || 1,
                    expiresAt: form.expiresAt || null,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.message ?? 'Could not create promo code.');
                return;
            }

            setShowForm(false);
            setForm({ ...form, code: '' });
            load();
        } catch {
            setError('Could not reach the STARA API.');
        }
    };

    const toggleActive = async (row) => {
        await fetch(API_BASE + '/api/promo-codes/' + row.id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { Authorization: 'Bearer ' + authToken } : {}),
            },
            body: JSON.stringify({ active: !row.active }),
        });
        load();
    };

    if (!featureAccess.canManagePromoCodes) {
        return (
            <div className="bg-white rounded-2xl p-8 border border-border text-center text-text-muted">
                Admin access required to manage promo codes.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-text">Promo Codes</h3>
                <button onClick={() => setShowForm((s) => !s)} className="px-4 py-2 bg-primary text-text-inverse text-sm font-semibold rounded-xl">
                    {showForm ? 'Cancel' : '+ New Promo Code'}
                </button>
            </div>

            {error && <div className="bg-error-bg text-error text-sm rounded-xl p-3">{error}</div>}

            {showForm && (
                <div className="bg-white border border-border rounded-2xl p-5 grid sm:grid-cols-3 gap-3">
                    <input placeholder="CODE (e.g. STAWI20)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="px-3 py-2 rounded-xl border border-border text-sm" />
                    <select value={form.promoType} onChange={(e) => setForm({ ...form, promoType: e.target.value })} className="px-3 py-2 rounded-xl border border-border text-sm">
                        {PROMO_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                    </select>
                    {form.promoType === 'percentage' ? (
                        <input placeholder="% off" type="number" value={form.percentageOff} onChange={(e) => setForm({ ...form, percentageOff: e.target.value })} className="px-3 py-2 rounded-xl border border-border text-sm" />
                    ) : (
                        <input placeholder="Fixed KES off" type="number" value={form.fixedAmountOff} onChange={(e) => setForm({ ...form, fixedAmountOff: e.target.value })} className="px-3 py-2 rounded-xl border border-border text-sm" />
                    )}
                    <input placeholder="Min transaction (KES)" type="number" value={form.minTransactionValue} onChange={(e) => setForm({ ...form, minTransactionValue: e.target.value })} className="px-3 py-2 rounded-xl border border-border text-sm" />
                    <input placeholder="Total usage limit (blank = unlimited)" type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="px-3 py-2 rounded-xl border border-border text-sm" />
                    <input placeholder="Per-user limit" type="number" value={form.perUserLimit} onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })} className="px-3 py-2 rounded-xl border border-border text-sm" />
                    <input placeholder="Expires at (YYYY-MM-DD)" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="px-3 py-2 rounded-xl border border-border text-sm" />
                    <button onClick={handleCreate} className="px-4 py-2 bg-secondary text-text-inverse text-sm font-semibold rounded-xl sm:col-span-3">
                        Create Promo Code
                    </button>
                </div>
            )}

            <div className="bg-white border border-border rounded-2xl overflow-hidden">
                {loading ? (
                    <p className="p-6 text-sm text-text-muted">Loading…</p>
                ) : codes.length === 0 ? (
                    <p className="p-6 text-sm text-text-muted">No promo codes yet, or the API isn't running.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-surface-muted text-text-muted text-xs uppercase">
                            <tr>
                                <th className="text-left p-3">Code</th>
                                <th className="text-left p-3">Type</th>
                                <th className="text-left p-3">Value</th>
                                <th className="text-left p-3">Redemptions</th>
                                <th className="text-left p-3">Revenue Impact</th>
                                <th className="text-left p-3">Status</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {codes.map((row) => (
                                <tr key={row.id} className="border-t border-border">
                                    <td className="p-3 font-semibold text-text">{row.code}</td>
                                    <td className="p-3 text-text-muted capitalize">{row.promo_type.replace('_', ' ')}</td>
                                    <td className="p-3 text-text-muted">
                                        {row.percentage_off ? row.percentage_off + '%' : row.fixed_amount_off ? formatKES(Number(row.fixed_amount_off)) : '—'}
                                    </td>
                                    <td className="p-3 text-text-muted">{row.total_redemptions} / {row.usage_limit ?? '∞'}</td>
                                    <td className="p-3 text-text-muted">-{formatKES(Number(row.total_discount_given))}</td>
                                    <td className="p-3">
                                        <span className={'text-xs font-semibold px-2 py-0.5 rounded-full ' + (row.active ? 'bg-success-bg text-success' : 'bg-disabled-bg text-disabled-text')}>
                                            {row.active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => toggleActive(row)} className="text-xs font-semibold text-primary hover:underline">
                                            {row.active ? 'Disable' : 'Enable'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}